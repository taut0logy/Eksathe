<?php

namespace App\Jobs;

use App\Events\ServerDeleted;
use App\Models\Server;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DeleteServerJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Server $server)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $id = $this->server->id;
        $name = $this->server->name;
        $this->server->last_message_id = null;
        $this->server->save();

        $this->server->messages->each->delete();

        $this->server->users()->detach();

        $this->server->delete();

        //dd('Server deleted', $id, $name);

        ServerDeleted::dispatch($id, $name);
    }
}
