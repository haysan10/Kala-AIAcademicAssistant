<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Crypt;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'grok_api_key',
        'timezone',
        'ai_language',
        'ai_persona',
        'ai_custom_instructions',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'grok_api_key',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Encrypt API key
    public function setGrokApiKeyAttribute(?string $value): void
    {
        $this->attributes['grok_api_key'] = $value ? Crypt::encryptString($value) : null;
    }

    public function getGrokApiKeyAttribute(?string $value): ?string
    {
        return $value ? Crypt::decryptString($value) : null;
    }

    public function hasGrokApiKey(): bool
    {
        return !empty($this->attributes['grok_api_key']);
    }

    // Relationships
    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }
}
