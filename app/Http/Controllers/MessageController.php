<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMesageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\Server;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;

class MessageController extends BaseController
{
    public function messagesByServer(Server $server)
    {
        $messages = Message::where('server_id', $server->id)->latest()->paginate(20);
        return  Inertia('Dashboard', ['selectedConversation' => $server->toConversationArray(), 'messages' => MessageResource::collection($messages)]);
    }

    public function messagesByUser(User $user)
    {
        $messages = Message::where('sender_id', auth()->id())->where('receiver_id', $user->id)->orWhere('sender_id', $user->id)->where('receiver_id', auth()->id())
            ->latest()->paginate(20);
        return  Inertia('Dashboard', ['selectedConversation' => $user->toConversationArray(), 'messages' => MessageResource::collection($messages)]);
    }

    public function loadOlderMessages(Message $message)
    {
        //Log::info('message older', [$message]);
        if ($message->server_id) {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where('server_id', $message->server_id)
                ->latest()->paginate(20);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where('sender_id', $message->sender_id,)
                ->where('receiver_id', $message->receiver_id)
                ->orWhere('created_at', '<', $message->created_at)
                ->where('sender_id', $message->receiver_id)
                ->where('receiver_id', $message->sender_id)
                ->latest()->paginate(20);
        }
        //$response = MessageResource::collection($messages);
        //Log::info('message newer', [$response]);
        // return $response;
        return MessageResource::collection($messages);
    }

    public function store(StoreMesageRequest $request)
    {
        //Log::info('Request:', $request->all());
        $data = $request->validated();
        //Log::info('Validated Data:', $data);
        $data['sender_id'] = auth()->id();
        $receiverId = $data['receiver_id'] ?? null;
        $serverId = $data['server_id'] ?? null;
        $files = $data['attachments'] ?? [];
        $Message = Message::create($data);
        Log::info('Message data', [$data]);
        Log::info('Message', [$Message]);
        $attachments = [];
        if ($files) {
            foreach ($files as $file) {
                $dir = 'attachments/' . Str::random(32);
                Storage::makeDirectory($dir);
                $model = [
                    'message_id' => $Message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($dir, 'public')
                ];
                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }
            $Message->attachments = $attachments;
        }
        if ($receiverId) {
            Conversation::updateConvWithMessage($receiverId, auth()->id(), $Message);
        }
        if ($serverId) {
            Server::updateConvWithMessage($serverId, $Message);
        }
        SocketMessage::dispatch($Message);
        return new MessageResource($Message);
    }

    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $server = null;
        $conversation = null;
        $lastMessage = null;

        if ($message->server_id) {
            $server = Server::where('last_message_id', $message->id)->first();
        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();
        }

        $message->delete();

        if ($server) {
            $server = Server::find($server->id);
            $lastMessage = $server->lastMessage;
        } else if ($conversation) {
            $conversation = Conversation::find($conversation->id);
            $lastMessage = $conversation->lastMessage;
        }

        return response()->json(['message' => $lastMessage ? new MessageResource($lastMessage) : null]);
    }
}
