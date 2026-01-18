<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Milestone extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'assignment_id',
        'title',
        'description',
        'order_index',
        'progress',
    ];

    protected function casts(): array
    {
        return [
            'order_index' => 'integer',
            'progress' => 'integer',
        ];
    }

    // Relationships
    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class)->orderBy('order_index');
    }

    // Accessors
    public function getCompletedTasksCountAttribute(): int
    {
        return $this->tasks()->where('is_completed', true)->count();
    }

    public function getTotalTasksCountAttribute(): int
    {
        return $this->tasks()->count();
    }

    public function getTotalEstimatedMinutesAttribute(): int
    {
        return $this->tasks()->sum('estimated_minutes');
    }

    // Methods
    public function recalculateProgress(): void
    {
        $total = $this->tasks()->count();
        $completed = $this->tasks()->where('is_completed', true)->count();

        $this->progress = $total > 0 ? (int) round(($completed / $total) * 100) : 0;
        $this->save();
    }
}
