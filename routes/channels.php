<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

//Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//    return (int) $user->id === (int) $id;
//});

Broadcast::channel('online', function (User $user) {
    return $user ? new UserResource($user): null;
});

Broadcast::channel('message.user.{id1}-{id2}', function (User $user,int $id1,int $id2) {
   return (int) $user->id === (int) $id1 || (int) $user->id === (int) $id2 ? new UserResource($user): null;
});

Broadcast::channel('message.server.{id}', function (User $user, int $id) {
    return $user->servers->contains($id) ? new UserResource($user): null;
});
