<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use LaravelIdea\Helper\App\Models\_IH_User_C;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'name',
        'email',
        'profile_photo_path',
        'cover_photo_path',
        'password',
        'last_login_at',
        'is_online',
        'is_admin',
        'email_verified_at',
        'password_changed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id',
        'password',
        'remember_token',
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

    public function servers(): BelongsToMany
    {
        return $this->belongsToMany(Server::class, 'server_users', 'user_id', 'server_id');
    }

    public static function getUsersExcept(User $user) : Collection
    {
        $id = $user->id;
        return User::select(['users.*','messages.body as last_message','messages.created_at as last_message_at'])
            ->where('users.id', '!=', $user->id)
            ->when(!$user->is_admin, function ($query) {
                $query->whereNull('users.blocked_at');
            })->leftJoin('conversations', function ($join) use ($id) {
                $join->on('conversations.user_id_1', '=', 'users.id')
                    ->where('conversations.user_id_2', '=', $id)
                    ->orWhere(function ($query) use ($id) {
                        $query->on('conversations.user_id_2', '=', 'users.id')
                            ->where('conversations.user_id_1', '=', $id);
                    });
        })->leftJoin('messages','messages.id','=','conversations.last_message_id')
            ->orderByRaw('IFNULL(users.blocked_at, 1)')
            ->orderBy('last_message_at', 'desc')
            ->orderBy('users.username')->get();
    }

    public function toConversationArray(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'name' => $this->name,
            'is_server' => false,
            'is_user' => true,
            'is_admin' => (bool) $this->is_admin,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'blocked_at' => $this->blocked_at,
            'last_message_at' => $this->last_message_at,
            'last_message' => $this->last_message
            ];
    }
}
