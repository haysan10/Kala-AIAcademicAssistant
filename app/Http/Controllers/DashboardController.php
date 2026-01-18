<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $assignments = Assignment::forUser($request->user()->id)
            ->active()
            ->orderBy('due_date')
            ->with(['milestones' => fn($q) => $q->withCount('tasks')])
            ->get()
            ->map(fn($assignment) => [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'due_date' => $assignment->due_date->toISOString(),
                'days_remaining' => $assignment->days_remaining,
                'progress_percent' => $assignment->progress_percent,
                'status' => $assignment->status,
                'is_at_risk' => $assignment->is_at_risk,
                'total_tasks' => $assignment->total_tasks_count,
                'completed_tasks' => $assignment->completed_tasks_count,
            ]);

        $stats = [
            'total_assignments' => Assignment::forUser($request->user()->id)->count(),
            'active_assignments' => Assignment::forUser($request->user()->id)->active()->count(),
            'completed_assignments' => Assignment::forUser($request->user()->id)->where('status', 'completed')->count(),
            'at_risk_assignments' => Assignment::forUser($request->user()->id)->where('status', 'at_risk')->count(),
        ];

        $nextTask = \App\Models\Task::select('tasks.*')
            ->join('milestones', 'tasks.milestone_id', '=', 'milestones.id')
            ->join('assignments', 'milestones.assignment_id', '=', 'assignments.id')
            ->where('assignments.user_id', $request->user()->id)
            ->where('assignments.status', '!=', 'completed')
            ->where('tasks.is_completed', false)
            ->orderBy('assignments.due_date')
            ->orderBy('milestones.order_index')
            ->orderBy('tasks.order_index')
            ->with(['milestone.assignment'])
            ->first();

        return Inertia::render('Dashboard', [
            'assignments' => $assignments->values()->all(),
            'stats' => $stats,
            'next_task' => $nextTask ? [
                'id' => $nextTask->id,
                'title' => $nextTask->title,
                'assignment_id' => $nextTask->milestone->assignment_id,
                'assignment_title' => $nextTask->milestone->assignment->title,
                'estimated_minutes' => $nextTask->estimated_minutes,
            ] : null,
        ]);
    }
}
