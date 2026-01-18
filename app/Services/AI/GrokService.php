<?php

namespace App\Services\AI;

use OpenAI;
use OpenAI\Client;
use Illuminate\Support\Facades\Log;

class GrokService
{
    protected Client $client;
    protected string $model;

    // Available Groq models
    protected const AVAILABLE_MODELS = [
        'llama-3.3-70b-versatile',
        'llama-3.1-70b-versatile',
        'llama-3.1-8b-instant',
        'mixtral-8x7b-32768',
        'gemma2-9b-it',
    ];

    public function __construct(?string $apiKey = null)
    {
        $key = $apiKey ?? config('services.grok.key');

        if (empty($key)) {
            throw new \RuntimeException('Grok API key is not configured');
        }

        $this->client = OpenAI::factory()
            ->withApiKey($key)
            ->withBaseUri(config('services.grok.base_url', 'https://api.groq.com/openai/v1'))
            ->make();

        $model = config('services.grok.model', 'llama-3.3-70b-versatile');

        // Validate model
        if (!in_array($model, self::AVAILABLE_MODELS)) {
            Log::warning('Invalid Groq model specified, using default', [
                'specified' => $model,
                'default' => 'llama-3.3-70b-versatile'
            ]);
            $model = 'llama-3.3-70b-versatile';
        }

        $this->model = $model;
    }

    /**
     * Validate if an API key is valid and active
     */
    public static function validateApiKey(string $apiKey): array
    {
        try {
            // Create temporary client with the API key
            $client = OpenAI::factory()
                ->withApiKey($apiKey)
                ->withBaseUri(config('services.grok.base_url', 'https://api.groq.com/openai/v1'))
                ->make();

            // Make a minimal test request
            $response = $client->chat()->create([
                'model' => config('services.grok.model', 'llama-3.3-70b-versatile'),
                'messages' => [
                    ['role' => 'user', 'content' => 'Hi']
                ],
                'max_tokens' => 5,
            ]);

            // If we get here, the API key is valid
            return [
                'valid' => true,
                'message' => 'API key is valid and active',
            ];
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            // Parse error to provide user-friendly message
            if (str_contains($errorMessage, 'Unauthorized') || str_contains($errorMessage, '401')) {
                return [
                    'valid' => false,
                    'message' => 'Invalid API key. Please check your GROQ API key.',
                ];
            } elseif (str_contains($errorMessage, 'quota') || str_contains($errorMessage, 'rate limit')) {
                return [
                    'valid' => false,
                    'message' => 'API key quota exceeded or rate limited.',
                ];
            } else {
                return [
                    'valid' => false,
                    'message' => 'Unable to verify API key: ' . $errorMessage,
                ];
            }
        }
    }

    /**
     * Send a chat completion request to Groq
     */
    public function chat(array $messages, array $options = []): string
    {
        try {
            // Validate model if provided in options
            $model = $options['model'] ?? $this->model;
            if (!in_array($model, self::AVAILABLE_MODELS)) {
                Log::warning('Invalid model in options, using default', [
                    'provided' => $model,
                    'default' => $this->model
                ]);
                $model = $this->model;
            }

            $params = [
                'model' => $model,
                'messages' => $messages,
                'temperature' => (float) ($options['temperature'] ?? config('services.grok.temperature', 0.7)),
                'max_tokens' => (int) ($options['max_tokens'] ?? config('services.grok.max_tokens', 4096)),
            ];

            Log::debug('Groq API request', [
                'model' => $params['model'],
                'message_count' => count($messages),
                'temperature' => $params['temperature'],
            ]);

            $response = $this->client->chat()->create($params);

            // Validate response
            if (!isset($response->choices[0]->message->content)) {
                Log::error('Groq API returned invalid response structure', [
                    'response' => json_encode($response)
                ]);
                throw new \RuntimeException('Invalid response from Groq API');
            }

            $content = $response->choices[0]->message->content;

            Log::debug('Groq API response', [
                'finish_reason' => $response->choices[0]->finishReason ?? 'unknown',
                'content_length' => strlen($content),
                'usage' => [
                    'prompt_tokens' => $response->usage->promptTokens ?? 0,
                    'completion_tokens' => $response->usage->completionTokens ?? 0,
                    'total_tokens' => $response->usage->totalTokens ?? 0,
                ]
            ]);

            return $content;
        } catch (\OpenAI\Exceptions\ErrorException $e) {
            // Handle Groq-specific errors
            $errorMessage = $e->getMessage();

            Log::error('Groq API error', [
                'error' => $errorMessage,
                'model' => $model ?? $this->model,
            ]);

            // Provide user-friendly error messages
            if (str_contains($errorMessage, 'rate_limit')) {
                throw new \RuntimeException('Groq API rate limit exceeded. Please try again later.');
            } elseif (str_contains($errorMessage, 'invalid_api_key')) {
                throw new \RuntimeException('Invalid Groq API key. Please check your configuration.');
            } elseif (str_contains($errorMessage, 'model_not_found')) {
                throw new \RuntimeException('The specified model is not available.');
            }

            throw new \RuntimeException('Groq API error: ' . $errorMessage);
        } catch (\Exception $e) {
            Log::error('Unexpected error calling Groq API', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Parse response as JSON
     */
    public function parseAsJson(string $prompt, ?string $systemPrompt = null): array
    {
        $messages = [];

        $messages[] = [
            'role' => 'system',
            'content' => $systemPrompt ?? 'You are a JSON-only response bot. Always respond with valid JSON. No markdown, no explanation, just pure JSON.'
        ];

        $messages[] = ['role' => 'user', 'content' => $prompt];

        $response = $this->chat($messages, ['temperature' => 0.3]);

        // Clean potential markdown code blocks
        $response = preg_replace('/```json\s*/', '', $response);
        $response = preg_replace('/```\s*/', '', $response);
        $response = trim($response);

        // Attempt to extract JSON object if response contains extra text
        $firstBrace = strpos($response, '{');
        $lastBrace = strrpos($response, '}');

        if ($firstBrace !== false && $lastBrace !== false && $lastBrace > $firstBrace) {
            $response = substr($response, $firstBrace, $lastBrace - $firstBrace + 1);
        }

        $decoded = json_decode($response, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning('Grok returned invalid JSON', [
                'response' => $response,
                'error' => json_last_error_msg(),
            ]);
            return [];
        }

        return $decoded;
    }
}
