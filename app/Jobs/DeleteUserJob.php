<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Server;
use App\Models\Conversation;
use Illuminate\Support\Facades\Storage;

class DeleteUserJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public User $user)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $id = $this->user->id;
        $name = $this->user->name;
        foreach($this->user->servers as $server){
            $server->users()->detach($this->user->id);
        }
        foreach($this->user->messages as $message){
            if ($message->server_id) {
                $server = Server::where('last_message_id', $message->id)->first();
            } else {
                $conversation = Conversation::where('last_message_id', $message->id)->first();
            }

            foreach ($message->attachments as $attachment) {
                Storage::delete($attachment->path);
                $attachment->delete();
            }

            $message->delete();

            if ($server) {
                $server = Server::find($server->id);
                $lastMessage = $server->lastMessage;
            } else if ($conversation) {
                $conversation = Conversation::find($conversation->id);
                $lastMessage = $conversation->lastMessage;
            }
        }
        $this->user->delete();

        //dd('User deleted', $id, $name);
    }
}
