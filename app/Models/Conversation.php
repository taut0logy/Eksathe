<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id_1',
        'user_id_2'
    ];

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_1');
    }

    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_2');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public static function getConversationsForSidebar($user) {
        $users=User::getUsersExcept($user);
        $servers=Server::getServersFor($user);
        return $users->map(function (User $user) {
            return $user->toConversationArray();
        })->concat($servers->map(function (Server $server) {
            return $server->toConversationArray();
        }));
    }

}
