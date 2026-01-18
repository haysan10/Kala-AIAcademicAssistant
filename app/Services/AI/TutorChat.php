<?php

namespace App\Services\AI;

use App\Models\Assignment;
use App\Models\ChatMessage;
use App\Models\Task;

class TutorChat
{
    protected GrokService $grok;
    protected ?\App\Models\User $user;

    public function __construct(?string $apiKey = null, ?\App\Models\User $user = null)
    {
        $this->grok = new GrokService($apiKey);
        $this->user = $user;
    }

    /**
     * Chat with the AI tutor about an assignment
     */
    public function chat(Assignment $assignment, string $userMessage, ?Task $currentTask = null): string
    {
        $context = $this->buildContext($assignment, $currentTask);
        $history = $this->getRecentHistory($assignment);

        // Personalization
        $language = $this->user?->ai_language ?? 'id';
        $persona = $this->user?->ai_persona ?? 'academic';
        $customInstructions = $this->user?->ai_custom_instructions ?? '';

        $personaPrompts = [
            'academic' => 'You are a formal, thorough, and highly intellectual academic mentor. Use precise terminology and focus on methodology.',
            'motivational' => 'You are an energetic, inspiring, and highly supportive coach. Use encouraging language and focus on the student\'s potential.',
            'casual' => 'You are a friendly, relatable, and easy-going peer tutor. Use modern, simple language and a relaxed yet helpful tone.',
            'professional' => 'You are a direct, efficient, and result-oriented professional advisor. Focus on clarity, structure, and practical outcomes.',
        ];

        $personaText = $personaPrompts[$persona] ?? $personaPrompts['academic'];
        $languageContext = $language === 'id' ? 'Always respond in Indonesian (Bahasa Indonesia).' : 'Always respond in English.';

        $systemPrompt = <<<PROMPT
You are Kala, a world-class AI Academic Tutor. 

PERSONA:
{$personaText}

LANGUAGE:
{$languageContext}

CUSTOM USER INSTRUCTIONS:
{$customInstructions}

CORE MISSION:
Your goal is to guide students towards deep understanding and independent completion of their work. You act as a mentor, coach, and subject matter expert.

CURRENT ASSIGNMENT CONTEXT:
{$context}

TUTORING PROTOCOLS:
1. ACADEMIC INTEGRITY FIRST: Never provide direct answers, complete solutions, or write any part of the assignment.
2. DISCOVERY THROUGH INQUIRY: Use Socratic questioning. Lead the student to the answer.
3. SCAFFOLDING: Help break tasks into smaller, manageable chunks.
4. CLARITY: Explain complex concepts using analogies.
5. STRATEGIC GUIDANCE: Suggest research methods or structural outlines.
6. EMOTIONAL SUPPORT: Be encouraging and validate the student's effort.
7. FORMATTING: Use Markdown (bold, lists, code blocks).

Remember: Success is not just a finished assignment, but a student who understands *how* they finished it.
PROMPT;

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ...$history,
            ['role' => 'user', 'content' => $userMessage],
        ];

        $response = $this->grok->chat($messages);

        // Save messages to history
        $this->saveMessage($assignment, 'user', $userMessage, $currentTask);
        $this->saveMessage($assignment, 'assistant', $response, $currentTask);

        return $response;
    }

    /**
     * Generate a checklist for a specific task
     */
    public function generateChecklist(Task $task): array
    {
        $assignment = $task->assignment;

        $prompt = <<<PROMPT
Create a hyper-practical, step-by-step checklist to help a student complete the following specific task.

CONTEXT:
- Assignment: {$assignment->title}
- Current Task: {$task->title}
- Task Description: {$task->description}
- Strategy Hint: {$task->context_hint}

GOAL: Provide a clear path to starting and finishing this task effectively.

JSON STRUCTURE:
{
  "checklist": [
    {
      "item": "Concise actionable step (e.g., 'Locate 3 peer-reviewed sources')", 
      "hint": "Strategic tip or mini-explanation (e.g., 'Use Google Scholar with keywords like...') "
    }
  ]
}

RULES:
- Return ONLY valid JSON
- Create 3-6 steps
- Ensure steps are sequentially logical
PROMPT;

        return $this->grok->parseAsJson($prompt, 'You are an expert academic workflow designer.');
    }

    /**
     * Generate 1-2 assessment questions to check user's understanding of a task
     */
    public function generateAssessmentQuiz(Task $task): array
    {
        $assignment = $task->assignment;
        $language = $this->user?->ai_language ?? 'id';
        $languageText = $language === 'id' ? 'Indonesian' : 'English';

        $prompt = <<<PROMPT
Generate 1-2 thought-provoking questions to assess if the student truly understands the material related to this task.

CONTEXT:
- Assignment: {$assignment->title}
- Task: {$task->title}
- Task Description: {$task->description}

GOAL: Ask questions that require more than a 'yes/no' answer. They should test application or synthesis of the task's material.

JSON STRUCTURE:
{
  "questions": [
    {
      "id": 1,
      "question": "The question text in {$languageText}",
      "context": "Briefly why this question matters"
    }
  ]
}
PROMPT;

        return $this->grok->parseAsJson($prompt, 'You are an expert educational assessor.');
    }

    /**
     * Evaluate the user's answer to an assessment question
     */
    public function evaluateAssessment(Task $task, array $answers): array
    {
        $assignment = $task->assignment;
        $language = $this->user?->ai_language ?? 'id';
        $languageText = $language === 'id' ? 'Indonesian' : 'English';

        $answersJson = json_encode($answers);

        $prompt = <<<PROMPT
Evaluate the student's understanding based on their answers to the assessment questions.

TASK CONTEXT:
- Assignment: {$assignment->title}
- Task: {$task->title}
- User Answers: {$answersJson}

GOAL: Provide a score (1-100) and constructive feedback (in {$languageText}).

JSON STRUCTURE:
{
  "score": 85,
  "feedback": "Clear explanation of the concept, though you could have mentioned...",
  "mastery_level": "High"
}
PROMPT;

        return $this->grok->parseAsJson($prompt, 'You are a supportive yet rigorous academic evaluator.');
    }

    /**
     * Build context string from assignment and current task
     */
    protected function buildContext(Assignment $assignment, ?Task $currentTask = null): string
    {
        $context = "Assignment: {$assignment->title}\n";
        $context .= "Description: {$assignment->description}\n";
        $context .= "Due Date: {$assignment->due_date->format('F j, Y g:i A')}\n";
        $context .= "Progress: {$assignment->progress_percent}% complete\n";
        $context .= "Days Remaining: {$assignment->days_remaining}\n";

        if ($currentTask) {
            $context .= "\nCurrent Task: {$currentTask->title}\n";
            $context .= "Task Description: {$currentTask->description}\n";
            if ($currentTask->context_hint) {
                $context .= "Task Hint: {$currentTask->context_hint}\n";
            }
        }

        if ($assignment->raw_context) {
            $context .= "\nOriginal Assignment Instructions:\n{$assignment->raw_context}\n";
        }

        return $context;
    }

    /**
     * Get recent chat history for the assignment
     */
    protected function getRecentHistory(Assignment $assignment, int $limit = 10): array
    {
        return $assignment->chatMessages()
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get()
            ->reverse()
            ->map(fn(ChatMessage $msg) => [
                'role' => $msg->role,
                'content' => $msg->content,
            ])
            ->values()
            ->toArray();
    }

    /**
     * Save a message to the chat history
     */
    protected function saveMessage(Assignment $assignment, string $role, string $content, ?Task $task = null): ChatMessage
    {
        return ChatMessage::create([
            'assignment_id' => $assignment->id,
            'task_id' => $task?->id,
            'role' => $role,
            'content' => $content,
        ]);
    }
}
