<?php

namespace App\Events;

use App\Http\Resources\ServerResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Server;
use Illuminate\Support\Facades\Log;

class ServerDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public int $id, public string $name)
    {
        //
    }

    // public function broadcastWith(): array
    // {
    //     return [
    //         'server' => new ServerResource($this->server)
    //     ];
    // }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
       // Log::info('ServerDeleted broadcastOn', ['id' => $this->id, 'name' => $this->name]);
        return [
            new PrivateChannel('server.deleted.'.$this->id),
        ];
    }
}
