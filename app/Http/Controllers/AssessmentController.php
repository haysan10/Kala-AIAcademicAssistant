<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Services\AI\TutorChat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AssessmentController extends Controller
{
    /**
     * Generate quiz for a task
     */
    public function generateQuiz(Request $request, Task $task)
    {
        Gate::authorize('view', $task->assignment);

        $apiKey = $request->user()->hasGrokApiKey()
            ? $request->user()->grok_api_key
            : config('services.grok.key');

        $tutor = new TutorChat($apiKey, $request->user());
        $quiz = $tutor->generateAssessmentQuiz($task);

        return response()->json($quiz);
    }

    /**
     * Submit answers for a task assessment
     */
    public function submitAnswers(Request $request, Task $task)
    {
        Gate::authorize('view', $task->assignment);

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required',
            'answers.*.answer' => 'required|string',
        ]);

        $apiKey = $request->user()->hasGrokApiKey()
            ? $request->user()->grok_api_key
            : config('services.grok.key');

        $tutor = new TutorChat($apiKey, $request->user());
        $evaluation = $tutor->evaluateAssessment($task, $validated['answers']);

        // Update task with assessment results
        $task->update([
            'mastery_assessment' => $evaluation['feedback'],
            'understanding_score' => $evaluation['score'],
        ]);

        return response()->json($evaluation);
    }
}
