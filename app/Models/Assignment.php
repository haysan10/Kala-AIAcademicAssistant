<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Carbon\Carbon;

class Assignment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'due_date',
        'raw_context',
        'parsed_data',
        'status',
        'total_estimated_minutes',
        'completed_tasks_count',
        'total_tasks_count',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'datetime',
            'parsed_data' => 'array',
            'total_estimated_minutes' => 'integer',
            'completed_tasks_count' => 'integer',
            'total_tasks_count' => 'integer',
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class)->orderBy('order_index');
    }

    public function tasks(): HasManyThrough
    {
        return $this->hasManyThrough(Task::class, Milestone::class);
    }

    public function chatMessages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at');
    }

    // Accessors
    public function getProgressPercentAttribute(): int
    {
        if ($this->total_tasks_count === 0)
            return 0;
        return (int) round(($this->completed_tasks_count / $this->total_tasks_count) * 100);
    }

    public function getDaysRemainingAttribute(): int
    {
        return max(0, (int) Carbon::now()->diffInDays($this->due_date, false));
    }

    public function getIsAtRiskAttribute(): bool
    {
        $progressPercent = $this->progress_percent;
        $timePercent = $this->getTimeRemainingPercentage();
        return $progressPercent < 30 && $timePercent < 30;
    }

    public function getTimeRemainingPercentage(): float
    {
        $totalDays = $this->created_at->diffInDays($this->due_date);
        if ($totalDays === 0)
            return 0;
        return ($this->days_remaining / $totalDays) * 100;
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'in_progress', 'at_risk']);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('due_date', '>=', now())->orderBy('due_date');
    }

    // Methods
    public function recalculateProgress(): void
    {
        $this->total_tasks_count = $this->tasks()->count();
        $this->completed_tasks_count = $this->tasks()->where('is_completed', true)->count();

        if ($this->completed_tasks_count === $this->total_tasks_count && $this->total_tasks_count > 0) {
            $this->status = 'completed';
        } elseif ($this->is_at_risk) {
            $this->status = 'at_risk';
        } elseif ($this->completed_tasks_count > 0) {
            $this->status = 'in_progress';
        }

        $this->save();

        foreach ($this->milestones as $milestone) {
            $milestone->recalculateProgress();
        }
    }
}
