<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Task;
use App\Services\AI\TutorChat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ChatController extends Controller
{
    public function send(Request $request, Assignment $assignment)
    {
        Gate::authorize('view', $assignment);

        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'task_id' => 'nullable|uuid|exists:tasks,id',
        ]);

        $task = isset($validated['task_id'])
            ? Task::find($validated['task_id'])
            : null;

        $apiKey = $request->user()->hasGrokApiKey()
            ? $request->user()->grok_api_key
            : config('services.grok.key');

        $tutor = new TutorChat($apiKey, $request->user());

        try {
            $response = $tutor->chat($assignment, $validated['message'], $task);

            return response()->json([
                'success' => true,
                'message' => $response,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to get AI response.',
            ], 500);
        }
    }

    public function history(Assignment $assignment)
    {
        Gate::authorize('view', $assignment);

        $messages = $assignment->chatMessages()
            ->orderBy('created_at')
            ->get()
            ->map(fn($msg) => [
                'id' => $msg->id,
                'role' => $msg->role,
                'content' => $msg->content,
                'created_at' => $msg->created_at->toISOString(),
            ]);

        return response()->json(['messages' => $messages]);
    }

    public function generateChecklist(Request $request, Task $task)
    {
        Gate::authorize('view', $task->assignment);

        $apiKey = $request->user()->hasGrokApiKey()
            ? $request->user()->grok_api_key
            : config('services.grok.key');

        $tutor = new TutorChat($apiKey, $request->user());

        $checklist = $tutor->generateChecklist($task);

        return response()->json($checklist);
    }
}
