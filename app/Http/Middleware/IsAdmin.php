<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
//use Log;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(!auth()->user()->is_admin) {
            abort(403, 'You need admin privilege for this action');
        }
        return $next($request);
    }
}
