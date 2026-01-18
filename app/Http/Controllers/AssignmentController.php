<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Services\AI\AssignmentParser;
use App\Services\AI\PlanGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        Log::info('AssignmentController@index hit', ['user_id' => $request->user()?->id]);

        try {
            $assignments = Assignment::forUser($request->user()->id)
                ->orderBy('due_date')
                ->get()
                ->map(fn($assignment) => [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'due_date' => $assignment->due_date?->toISOString(),
                    'days_remaining' => $assignment->days_remaining,
                    'progress_percent' => $assignment->progress_percent,
                    'status' => $assignment->status,
                    'is_at_risk' => $assignment->is_at_risk,
                    'total_tasks' => $assignment->total_tasks_count,
                    'completed_tasks' => $assignment->completed_tasks_count,
                ]);

            Log::info('Assignments query successful', ['count' => $assignments->count()]);

            return Inertia::render('Assignment/Index', [
                'assignments' => $assignments->values()->all(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error in AssignmentController@index: ' . $e->getMessage());
            return Inertia::render('Assignment/Index', [
                'assignments' => [],
                'flash' => ['error' => 'Could not load assignments.']
            ]);
        }
    }

    public function create()
    {
        return Inertia::render('Assignment/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'raw_text' => 'nullable|string|max:50000',
            'file' => 'nullable|file|max:10240|mimes:pdf,txt,docx',
        ]);

        if (empty($validated['raw_text']) && !$request->hasFile('file')) {
            return back()->withErrors(['raw_text' => 'Please provide either instructions text or an assignment file.']);
        }

        $rawText = $validated['raw_text'] ?? null;

        if (empty($rawText) && $request->hasFile('file')) {
            $rawText = $this->extractTextFromFile($request->file('file'));
        }

        if (empty($rawText)) {
            return back()->withErrors(['raw_text' => 'Could not extract text from the provided source.']);
        }

        $apiKey = $request->user()->hasGrokApiKey()
            ? $request->user()->grok_api_key
            : config('services.grok.key');

        try {
            $parser = new AssignmentParser($apiKey, $request->user());
            $parsedData = $parser->parse($rawText);

            // Safely parse due date
            $dueDate = null;
            if (!empty($parsedData['due_date'])) {
                try {
                    $dueDate = \Carbon\Carbon::parse($parsedData['due_date']);
                } catch (\Exception $e) {
                    Log::warning('AI returned invalid date format', ['date' => $parsedData['due_date']]);
                    $dueDate = null;
                }
            }

            $assignment = Assignment::create([
                'user_id' => $request->user()->id,
                'title' => $parsedData['title'] ?? 'Untitled Assignment',
                'description' => $parsedData['description'] ?? null,
                'due_date' => $dueDate ?? now()->addWeeks(2),
                'raw_context' => $rawText,
                'parsed_data' => $parsedData,
                'status' => 'pending',
            ]);

            return redirect()->route('assignments.review', $assignment);
        } catch (\Exception $e) {
            Log::error('AI Analysis Failed', ['error' => $e->getMessage()]);
            return back()->withErrors([
                'raw_text' => 'AI Analysis failed: ' . $e->getMessage(),
                'file' => 'AI Analysis failed: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function review(Assignment $assignment)
    {
        Gate::authorize('view', $assignment);

        return Inertia::render('Assignment/Review', [
            'assignment' => [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'description' => $assignment->description,
                'due_date' => $assignment->due_date?->format('Y-m-d\TH:i'),
                'parsed_data' => $assignment->parsed_data,
            ],
        ]);
    }

    public function confirmAndPlan(Request $request, Assignment $assignment)
    {
        Gate::authorize('update', $assignment);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
        ]);

        $assignment->update($validated);

        try {
            $apiKey = $request->user()->hasGrokApiKey()
                ? $request->user()->grok_api_key
                : config('services.grok.key');

            $generator = new PlanGenerator($apiKey, $request->user());
            $generator->generate($assignment);

            $assignment->update(['status' => 'in_progress']);

            return redirect()->route('assignments.show', $assignment)
                ->with('success', 'Study plan generated successfully!');
        } catch (\Exception $e) {
            Log::error('Plan Generation Failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to generate study plan: ' . $e->getMessage()]);
        }
    }
    public function regeneratePlan(Assignment $assignment)
    {
        Gate::authorize('update', $assignment);

        try {
            // Delete existing milestones and tasks (cascade will handle tasks if set up, but let's be explicit if needed)
            $assignment->milestones()->delete();

            $apiKey = auth()->user()->hasGrokApiKey()
                ? auth()->user()->grok_api_key
                : config('services.grok.key');

            $generator = new PlanGenerator($apiKey, auth()->user());
            $generator->generate($assignment);

            $assignment->update(['status' => 'in_progress']);

            return back()->with('success', 'Study plan has been regenerated by AI!');
        } catch (\Exception $e) {
            Log::error('Plan Regeneration Failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to regenerate study plan: ' . $e->getMessage()]);
        }
    }

    public function show(Assignment $assignment)
    {
        Gate::authorize('view', $assignment);

        try {
            $assignment->load(['milestones' => fn($q) => $q->with('tasks')]);

            return Inertia::render('Assignment/Show', [
                'assignment' => [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'description' => $assignment->description,
                    'due_date' => $assignment->due_date?->toISOString() ?? now()->toISOString(),
                    'status' => $assignment->status,
                    'progress_percent' => $assignment->progress_percent,
                    'days_remaining' => $assignment->days_remaining,
                    'milestones' => $assignment->milestones,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in AssignmentController@show: ' . $e->getMessage());
            return redirect()->route('assignments.index')->with('error', 'Could not open assignment.');
        }
    }

    public function destroy(Assignment $assignment)
    {
        Gate::authorize('delete', $assignment);
        $assignment->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Assignment deleted successfully.');
    }

    protected function extractTextFromFile($file)
    {
        $extension = $file->getClientOriginalExtension();

        try {
            if ($extension === 'pdf') {
                return $this->extractFromPdf($file->path());
            } elseif ($extension === 'docx') {
                return $this->extractFromDocx($file->path());
            } elseif ($extension === 'txt') {
                return file_get_contents($file->path());
            }
        } catch (\Exception $e) {
            Log::error('Text extraction failed', ['error' => $e->getMessage()]);
            return null;
        }

        return null;
    }

    protected function extractFromPdf($path)
    {
        $parser = new \Smalot\PdfParser\Parser();
        $pdf = $parser->parseFile($path);
        return $pdf->getText();
    }

    protected function extractFromDocx($path)
    {
        $content = '';
        $zip = new \ZipArchive();
        if ($zip->open($path) === true) {
            if (($index = $zip->locateName('word/document.xml')) !== false) {
                $data = $zip->getFromIndex($index);
                $content = strip_tags($data);
            }
            $zip->close();
        }
        return $content;
    }
}
