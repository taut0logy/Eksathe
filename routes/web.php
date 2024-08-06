<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::middleware(['auth', 'verified', 'banned'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get("/user/{user}", [MessageController::class, 'messagesByUser'])->name('chat.user');
    Route::get("/server/{server}", [MessageController::class, 'messagesByServer'])->name('chat.server');
    Route::post('/message', [MessageController::class, 'store'])->name('message.store');
    Route::delete('/message/{message}', [MessageController::class, 'destroy'])->name('message.destroy');
    Route::get('/message/older/{message}', [MessageController::class, 'loadOlderMessages'])->name('message.load-older');

    Route::post('/server', [ServerController::class, 'store'])->name('server.store');
    Route::put('/server/{server}', [ServerController::class, 'update'])->name('server.update');
    Route::delete('/server/{server}', [ServerController::class, 'destroy'])->name('server.destroy');

    Route::middleware('admin')->group(function () {
        Route::post('/user/{user}/change-role', [UserController::class, 'changeRole'])->name('user.change-role');
        Route::post('/user/{user}/ban-unban', [UserController::class, 'banUnbanUser'])->name('user.ban-unban');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/mail', function () {
    return view('Mails.reset-password');
});

require __DIR__ . '/auth.php';
