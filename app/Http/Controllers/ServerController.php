<?php

namespace App\Http\Controllers;

use App\Models\Server;
use App\Http\Requests\StoreServerRequest;
use App\Http\Requests\UpdateServerRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use App\Jobs\DeleteServerJob;

class ServerController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServerRequest $request) : RedirectResponse
    {
        $data= $request->validated();
        $server = Server::create($data);
        $user_ids = $data['user_ids'] ?? [];
        $server->users()->attach(array_unique(array_merge([$request->user()->id], $user_ids)));

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServerRequest $request, Server $server) : RedirectResponse
    {
        $data= $request->validated();
        $server->update($data);
        $user_ids = $data['user_ids'] ?? [];
        $server->users()->detach();
        $server->users()->attach(array_unique(array_merge([$request->user()->id], $user_ids)));

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Server $server) : JsonResponse
    {
        if($server->owner_id !== auth()->id()) {
            abort(403);
        }

        DeleteServerJob::dispatch($server)->delay(now()->addSeconds(5));

        return response()->json(['message' => 'Server wil be deleted shortly.', 'server' => $server, 'status' => 200, 'success' => true]);
    }
}
