<?php

namespace App\Services\AI;

class AssignmentParser
{
    protected GrokService $grok;
    protected string $model;
    protected ?\App\Models\User $user;

    public function __construct(?string $apiKey = null, ?\App\Models\User $user = null)
    {
        $this->grok = new GrokService($apiKey);
        $this->model = config('services.grok.model', 'llama-3.3-70b-versatile');
        $this->user = $user;
    }

    /**
     * Parse raw assignment text and extract structured data
     */
    public function parse(string $rawText): array
    {
        $language = $this->user?->ai_language ?? 'id';
        $languageText = $language === 'id' ? 'Indonesian (Bahasa Indonesia)' : 'English';

        $prompt = <<<PROMPT
You are an expert academic assistant. Analyze the following academic assignment instructions and extract structured information.

OUTPUT LANGUAGE: {$languageText}

INSTRUCTIONS CONTENT:
---
{$rawText}
---

Your goal is to extract the following fields precisely. 

JSON STRUCTURE TO RETURN:
{
  "title": "Clear title in {$languageText}",
  "due_date": "YYYY-MM-DD HH:mm or null",
  "description": "Clear overview in {$languageText}",
  "deliverables": ["List of files/outputs in {$languageText}"],
  "requirements": ["List of constraints in {$languageText}"],
  "estimated_difficulty": "easy|medium|hard",
  "estimated_hours": number
}

RESPONSE RULES:
- Return ONLY valid JSON
- Use "YYYY-MM-DD HH:mm" for due_date.
- Be thorough but concise.
PROMPT;

        return $this->grok->parseAsJson($prompt, 'You are a professional academic coordinator specializing in assignment analysis and task management.');
    }
}
