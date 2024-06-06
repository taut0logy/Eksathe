<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
class UserController extends Controller
{
    public function changeRole(User $user)
    {
        Log::info("change role",["user"=>$user]);
        $user->is_admin = $user->is_admin ? false : true;

        $user->update();

        Log::info("change role",["user"=>$user]);

        $message = $user->is_admin ? 'User "'.$user->name. '" is now an admin' : 'User "'.$user->name. '" is no longer an admin';
        Log::info("after change role",["message"=>$message]);
        return response()->json(['message' => $message]);
    }

    public function blockUnblockUser(User $user)
    {
        if($user->blocked_at) {
            $user->blocked_at = null;

            $message = 'User "'.$user->name. '" is now unblocked';
        } else {
            $user->blocked_at = now();

            $message = 'User "'.$user->name. '" is now blocked';
        }
        $user->update();

        return response()->json(['message' => $message]);
    }
}
