<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Server extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'last_message_id'
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'server_users', 'server_id', 'user_id');
    }

    public function admins(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'server_admins', 'server_id', 'user_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public static function getServersFor(User $user) {
        return self::select(['servers.*','messages.body as last_message','messages.created_at as last_message_at'])
            ->join('server_users', 'server_users.server_id', '=', 'servers.id')
            ->leftJoin('messages', 'messages.id', '=', 'servers.last_message_id')
            ->where('server_users.user_id', '=', $user->id)
            ->orderBy('messages.created_at', 'desc')
            ->orderBy('servers.name')->get();
    }

    public function toConversationArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_server' => true,
            'is_user' => false,
            'owner_id' => $this->owner_id,
            'users' => $this->users,
            'admins' => $this->admins,
            'users_ids' => $this->users->pluck('id'),
            'admins_ids' => $this->admins->pluck('id'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'last_message_at' => $this->last_message_at,
            'last_message' => $this->last_message
            ];
    }

    public static function updateConvWithMessage($serverId, $Message)
    {
        return self::updateOrCreate(['id' => $serverId], [
            'last_message_id' => $Message->id
        ]);
    }
}
