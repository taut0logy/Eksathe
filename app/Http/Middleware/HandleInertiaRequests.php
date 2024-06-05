<?php

namespace App\Http\Middleware;

use App\Http\Resources\UserResource;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? new UserResource($request->user()) : null,
            ],
            'conversations' => Auth::id() ? Conversation::getConversationsForSidebar(Auth::user()) : [],
            'errors' => fn() => $request->session()->get('errors')
                ? $request->session()->get('errors')->getBag('default')->getMessages()
                : (object) [],
            'darkMode' => $request->session()->get('dark_mode') ?? false,
        ];
    }
}
