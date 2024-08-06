<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Message;

class MessageResource extends JsonResource
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
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'body' => $this->body,
            'sender' => new UserResource($this->sender),
            'server_id' => $this->server_id,
            'reply_to' => new MessageResource(Message::find($this->reply_to_id)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'attachments' => MessageAttachmentResource::collection($this->attachments)
        ];
    }
}
