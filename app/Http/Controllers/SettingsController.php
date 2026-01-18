<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index()
    {
        return Inertia::render('Settings/Index');
    }

    /**
     * Update the user's settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($request->user()->id),
            ],
            'grok_api_key' => ['nullable', 'string', 'max:500'],
            'ai_language' => ['required', 'string', 'in:id,en'],
            'ai_persona' => ['required', 'string', 'in:academic,motivational,casual,professional'],
            'ai_custom_instructions' => ['nullable', 'string', 'max:2000'],
        ]);

        // Validate Grok API key if provided
        if (!empty($validated['grok_api_key'])) {
            $validation = \App\Services\AI\GrokService::validateApiKey($validated['grok_api_key']);

            if (!$validation['valid']) {
                return Redirect::route('settings')
                    ->withErrors(['grok_api_key' => $validation['message']])
                    ->withInput();
            }
        }

        $request->user()->fill($validated);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('settings')->with('success', 'Settings updated successfully!');
    }
}
