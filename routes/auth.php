<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'loginPage'])->name('login');
    Route::post('login', [AuthController::class, 'login']);

    Route::get('register', [AuthController::class, 'registerPage'])->name('register');
    Route::post('register', [AuthController::class, 'register']);

    Route::get('forgot-password', [AuthController::class, 'forgotPasswordPage'])->name('forgot-password');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);

    Route::get('new-password', [AuthController::class, 'newPasswordPage'])->name('new-password');
    Route::post('new-password', [AuthController::class, 'newPassword']);
});

Route::middleware('auth')->group(function () {
    Route::get('/email/verify', [AuthController::class, 'verifyEmailPage'])->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware( 'signed')->name('verification.verify');

    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('message', 'Verification link sent!');
    })->middleware(['auth', 'throttle:6,1'])->name('verification.send');

    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/confirm-password', [AuthController::class, 'confirmPasswordPage'])->name('confirm-password');

    Route::post('/confirm-password', [AuthController::class, 'confirmPassword'])->name('confirm-password-post');

    Route::get('/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verify-email');
});
