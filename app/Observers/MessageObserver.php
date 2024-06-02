<?php

namespace App\Observers;

use App\Models\Message;
use App\Models\Server;
use Illuminate\Support\Facades\Storage;
use App\Models\Conversation;
use Illuminate\Support\Facades\Log;

class MessageObserver
{
    public function deleting(Message $message){
        $message->attachments->each(function($attachment){
            $dir=dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($dir);
        });
        $message->attachments()->delete();
        //Log::info('Deleting Message:', ['message' => $message]);
        if($message->server_id) {
            $server=Server::where('last_message_id', $message->id)->first();
            if($server) {
                $prevMessage = Message::where('server_id', $message->server_id)
                ->where('id', '!=', $message->id)->latest()->limit(1)->first();
                //Log::info('Prev Message:', ['message' => $prevMessage]);
                if($prevMessage) {
                    $server->last_message_id = $prevMessage->id;
                    $server->save();
                }
            }
        } else if($message->receiver_id) {
            $conversation = Conversation::where('last_message_id', $message->id)->first();
            if ($conversation) {
                $prevMessage = Message::where(function ($query) use ($conversation) {
                    $query->where('sender_id', $conversation->user_id_1)
                        ->where('receiver_id', $conversation->user_id_2)
                        ->orWhere('sender_id', $conversation->user_id_2)
                        ->where('receiver_id', $conversation->user_id_1);
                })->where('id', '!=', $message->id)->latest()->limit(1)->first();
                //Log::info('Prev Message:', ['message' => $prevMessage]);
                if ($prevMessage) {
                    $conversation->last_message_id = $prevMessage->id;
                    $conversation->save();
                }
            }
        } else {
            Log::info('Message is not associated with any server or conversation:', ['message' => $message]);
        }
    }
}
