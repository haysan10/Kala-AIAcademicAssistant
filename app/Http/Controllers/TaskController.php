<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'milestone_id' => 'required|exists:milestones,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'estimated_minutes' => 'nullable|integer|min:5|max:480',
        ]);

        $milestone = \App\Models\Milestone::findOrFail($validated['milestone_id']);
        Gate::authorize('update', $milestone->assignment);

        $task = \App\Models\Task::create([
            'milestone_id' => $milestone->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'estimated_minutes' => $validated['estimated_minutes'] ?? 30,
            'order_index' => $milestone->tasks()->count(),
        ]);

        $milestone->assignment->recalculateProgress();

        return response()->json([
            'success' => true,
            'task' => $task
        ]);
    }

    public function toggle(Request $request, Task $task)
    {
        Gate::authorize('update', $task->assignment);

        $task->toggleComplete();

        return response()->json([
            'success' => true,
            'is_completed' => $task->is_completed,
            'assignment_progress' => $task->assignment->progress_percent,
            'milestone_progress' => $task->milestone->progress,
        ]);
    }

    public function update(Request $request, Task $task)
    {
        Gate::authorize('update', $task->assignment);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'estimated_minutes' => 'sometimes|integer|min:5|max:480',
        ]);

        $task->update($validated);

        return response()->json(['success' => true]);
    }

    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task->assignment);

        $milestone = $task->milestone;
        $assignment = $task->assignment;

        $task->delete();

        $milestone->recalculateProgress();
        $assignment->recalculateProgress();

        return back()->with('success', 'Task deleted.');
    }
}
