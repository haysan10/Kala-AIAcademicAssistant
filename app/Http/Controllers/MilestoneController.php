<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MilestoneController extends Controller
{
    public function update(Request $request, Milestone $milestone)
    {
        Gate::authorize('update', $milestone->assignment);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $milestone->update($validated);

        return response()->json(['success' => true]);
    }

    public function destroy(Milestone $milestone)
    {
        Gate::authorize('delete', $milestone->assignment);

        $assignment = $milestone->assignment;
        $milestone->delete();

        $assignment->recalculateProgress();

        return back()->with('success', 'Milestone deleted.');
    }
}
