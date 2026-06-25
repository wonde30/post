<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'body',
        'author',
        'published',
    ];

    protected $casts = [
        'published' => 'boolean',
    ];

    // A post belongs to one user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
