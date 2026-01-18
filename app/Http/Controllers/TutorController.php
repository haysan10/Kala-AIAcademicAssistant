<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TutorController extends Controller
{
    /**
     * Display the AI Tutor page.
     */
    public function index(Request $request)
    {
        $assignments = $request->user()
            ->assignments()
            ->orderBy('due_date')
            ->get()
            ->map(fn(Assignment $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'description' => $a->description,
                'status' => $a->status,
                'due_date' => $a->due_date->toISOString(),
                'due_date_formatted' => $a->due_date->format('M j, Y'),
                'progress_percent' => $a->progress_percent,
                'days_remaining' => $a->days_remaining,
                'milestones_count' => $a->milestones->count(),
                'tasks_count' => $a->milestones->sum(fn($m) => $m->tasks->count()),
            ]);

        return Inertia::render('Tutor/Index', [
            'assignments' => $assignments,
        ]);
    }
}
