<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'milestone_id',
        'title',
        'description',
        'estimated_minutes',
        'is_completed',
        'completed_at',
        'context_hint',
        'order_index',
    ];

    protected function casts(): array
    {
        return [
            'estimated_minutes' => 'integer',
            'is_completed' => 'boolean',
            'completed_at' => 'datetime',
            'order_index' => 'integer',
        ];
    }

    // Relationships
    public function milestone(): BelongsTo
    {
        return $this->belongsTo(Milestone::class);
    }

    public function getAssignmentAttribute(): ?Assignment
    {
        return $this->milestone?->assignment;
    }

    // Methods
    public function toggleComplete(): void
    {
        $this->is_completed = !$this->is_completed;
        $this->completed_at = $this->is_completed ? now() : null;
        $this->save();

        $this->milestone->recalculateProgress();
        $this->milestone->assignment->recalculateProgress();
    }

    public function markComplete(): void
    {
        if (!$this->is_completed) {
            $this->toggleComplete();
        }
    }

    public function markIncomplete(): void
    {
        if ($this->is_completed) {
            $this->toggleComplete();
        }
    }
}
