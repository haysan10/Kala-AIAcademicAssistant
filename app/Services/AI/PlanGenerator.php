<?php

namespace App\Services\AI;

use App\Models\Assignment;
use App\Models\Milestone;
use App\Models\Task;

class PlanGenerator
{
  protected GrokService $grok;
  protected ?\App\Models\User $user;

  public function __construct(?string $apiKey = null, ?\App\Models\User $user = null)
  {
    $this->grok = new GrokService($apiKey);
    $this->user = $user;
  }

  /**
   * Generate a study plan with milestones and tasks for an assignment
   */
  public function generate(Assignment $assignment): array
  {
    $dueDate = $assignment->due_date->format('Y-m-d H:i');
    $today = now()->format('Y-m-d');
    $parsedData = json_encode($assignment->parsed_data ?? []);

    $language = $this->user?->ai_language ?? 'id';
    $languageText = match ($language) {
      'id' => 'Indonesian (Bahasa Indonesia) informal and natural',
      'en' => 'English',
      default => 'Indonesian'
    };

    $prompt = <<<PROMPT
You are a master Academic Planner. Create a comprehensive, step-by-step study plan to complete the following assignment.

OUTPUT LANGUAGE: {$languageText}

ASSIGNMENT DETAILS:
- Title: {$assignment->title}
- Overview: {$assignment->description}
- Due Date: {$dueDate} (Remaining time from today, {$today})
- Extracted Requirements: {$parsedData}

PLANNING RULES:
1. Break down the work into 3-5 logical milestones (phases like 'Research', 'Drafting', 'Refining').
2. Each milestone must contain 2-5 specific, actionable tasks.
3. Keep task titles short and descriptive (e.g., "Outline Literature Review").
4. Provide a helpful 'context_hint' for each task with specific tips or resources the student might need.
5. Estimate minutes realistically (increments of 15 or 30 mins).
6. Ensure the entire plan is completed at least 1 day before the due date.

RETURN JSON STRUCTURE:
{
  "milestones": [
    {
      "title": "Milestone Title",
      "description": "Short explanation of this phase",
      "tasks": [
        {
          "title": "Task Title",
          "description": "Actionable detail",
          "estimated_minutes": number,
          "context_hint": "Strategic advice for this specific task"
        }
      ]
    }
  ]
}

RESPONSE RULES:
- Return ONLY valid JSON
- Use the requested language: {$languageText}
- Be professional and encouraging
- Ensure the complexity matches the assignment's difficulty
PROMPT;

    $plan = $this->grok->parseAsJson($prompt, 'You are a professional academic success coach expert in project management for students.');

    if (empty($plan['milestones'])) {
      return [];
    }

    return $this->createFromPlan($assignment, $plan);
  }

  /**
   * Create milestones and tasks from AI-generated plan
   */
  protected function createFromPlan(Assignment $assignment, array $plan): array
  {
    $createdMilestones = [];
    $totalMinutes = 0;
    $totalTasks = 0;

    foreach ($plan['milestones'] as $index => $milestoneData) {
      $milestone = Milestone::create([
        'assignment_id' => $assignment->id,
        'title' => $milestoneData['title'],
        'description' => $milestoneData['description'] ?? null,
        'order_index' => $index,
      ]);

      $tasks = [];
      foreach ($milestoneData['tasks'] ?? [] as $taskIndex => $taskData) {
        $task = Task::create([
          'milestone_id' => $milestone->id,
          'title' => $taskData['title'],
          'description' => $taskData['description'] ?? null,
          'estimated_minutes' => $taskData['estimated_minutes'] ?? 30,
          'context_hint' => $taskData['context_hint'] ?? null,
          'order_index' => $taskIndex,
        ]);

        $tasks[] = $task;
        $totalMinutes += $task->estimated_minutes;
        $totalTasks++;
      }

      $milestone->load('tasks');
      $createdMilestones[] = $milestone;
    }

    // Update assignment with totals
    $assignment->update([
      'total_estimated_minutes' => $totalMinutes,
      'total_tasks_count' => $totalTasks,
      'status' => 'pending',
    ]);

    return $createdMilestones;
  }
}
