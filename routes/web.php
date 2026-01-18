<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TutorController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Assignments
    Route::resource('assignments', AssignmentController::class);
    Route::get('/assignments/{assignment}/review', [AssignmentController::class, 'review'])
        ->name('assignments.review');
    Route::post('/assignments/{assignment}/confirm', [AssignmentController::class, 'confirmAndPlan'])
        ->name('assignments.confirm');
    Route::post('/assignments/{assignment}/regenerate', [AssignmentController::class, 'regeneratePlan'])
        ->name('assignments.regenerate');

    // Tasks (API - JSON)
    Route::post('/tasks', [TaskController::class, 'store'])
        ->name('tasks.store');
    Route::patch('/tasks/{task}/toggle', [TaskController::class, 'toggle'])
        ->name('tasks.toggle');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])
        ->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])
        ->name('tasks.destroy');

    // Milestones (API - JSON)
    Route::patch('/milestones/{milestone}', [\App\Http\Controllers\MilestoneController::class, 'update'])
        ->name('milestones.update');
    Route::delete('/milestones/{milestone}', [\App\Http\Controllers\MilestoneController::class, 'destroy'])
        ->name('milestones.destroy');

    // Chat (API - JSON)
    Route::post('/assignments/{assignment}/chat', [ChatController::class, 'send'])
        ->name('chat.send');
    Route::get('/assignments/{assignment}/chat/history', [ChatController::class, 'history'])
        ->name('chat.history');
    Route::post('/tasks/{task}/checklist', [ChatController::class, 'generateChecklist'])
        ->name('chat.checklist');

    // Mastery Assessment
    Route::get('/tasks/{task}/assessment', [\App\Http\Controllers\AssessmentController::class, 'generateQuiz'])
        ->name('tasks.assessment.quiz');
    Route::post('/tasks/{task}/assessment', [\App\Http\Controllers\AssessmentController::class, 'submitAnswers'])
        ->name('tasks.assessment.submit');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::patch('/settings', [SettingsController::class, 'update'])->name('settings.update');

    // AI Tutor
    Route::get('/tutor', [TutorController::class, 'index'])->name('tutor');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
