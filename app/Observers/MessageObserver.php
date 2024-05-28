<?php

namespace App\Observers;

use App\Models\Message;
use App\Models\Server;
use Illuminate\Support\Facades\Storage;
use App\Models\Conversation;


class MessageObserver
{
    public function deleting(Message $message){
        $message->attachments->each(function($attachment){
            $dir=dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($dir);
        });
        $message->attachments()->delete();

        if($message->server_id) {
            $server=Server::where('last_message_id', $message->id)->first();
            if($server) {
                $prevMessage = Message::where('server_id', $message->server_id)
                ->where('id', '!=', $message->id)->latest()->limit(1)->first();
                if($prevMessage) {
                    $server->last_message_id = $prevMessage->id;
                    $server->save();
                }
            }
        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();
            if ($conversation) {
                $prevMessage = Message::where(function ($query) use ($conversation) {
                    $query->where('sender_id', $conversation->sender_id)
                        ->where('receiver_id', $conversation->receiver_id)
                        ->orWhere('sender_id', $conversation->receiver_id)
                        ->where('receiver_id', $conversation->sender_id);
                })->where('id', '!=', $message->id)->latest()->limit(1)->first();
                if ($prevMessage) {
                    $conversation->last_message_id = $prevMessage->id;
                    $conversation->save();
                }
            }
        }
    }
}
