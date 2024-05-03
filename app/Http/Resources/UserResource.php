<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'name' => $this->name,
            //'email' => $this->email,
            'profile_picture' => $this->profile_photo_path?Storage::url('profile_photo').$this->profile_photo_path:null,
            'role' => $this->role,
            'is_online' => $this->is_online,
            'is_admin' => $this->is_admin,
            'last_message' => $this->last_message,
            'last_message_at' => $this->last_message_at,
            'last_seen' => $this->last_seen
        ];
    }
}
