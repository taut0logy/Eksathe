<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        $user = User::where('email', $request->email)->first();

        if($user && $user->blocked_at) {
            return redirect()->back()->withErrors(['email'=> 'Sorry, you have been banned from using this platform.']);
        }

        if(Auth::attempt($credentials, $remember)){
            $user = User::where('email', $credentials['email'])->first();
            $request->session()->put('user_id', $user->id);
            $request->session()->put('authenticated', true);
            $request->session()->put('user_name', $user->name);
            $user->update(['last_login_at' => now()]);

            return redirect()->intended(route('dashboard'))->with('success', 'Login Successful. Welcome ' . $user->name . '!');
        }



        return redirect()->back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    // public function login(Request $request)
    // {
    //     $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required',
    //         'remember' => 'boolean',
    //     ]);

    //     $credentials = $request->only('email', 'password');
    //     $remember = $request->boolean('remember');

    //     $user = User::where('email', $credentials['email'])->first();

    //     if ($user && Hash::check($credentials['password'], $user->password)) {
    //         Auth::guard('web')->login($user);
    //         $request->session()->regenerate();

    //         $request->session()->put('user_id', $user->id);
    //         $request->session()->put('authenticated', true);
    //         $request->session()->put('user_name', $user->name);
    //         $request->session()->put('auth.password_confirmed_at', time());

    //         $user->update(['last_login_at' => now()]);

    //         // if ($remember) {
    //         //     $rememberToken = Str::random(60);
    //         //     DB::table('remember_tokens')->insert([
    //         //         'user_id' => $user->id,
    //         //         'token' => $rememberToken,
    //         //         'created_at' => now(),
    //         //         'updated_at' => now()
    //         //     ]);
    //         //     $cookie = cookie('remember_token', $rememberToken, 60 * 24 * 30);
    //         //     return redirect()->intended(route('dashboard'))->with('message', 'Login Successful. Welcome ' . $user->name . '!')->cookie($cookie);
    //         // }

    //         return redirect()->intended(route('dashboard'))->with('message', 'Login Successful. Welcome ' . $user->name . '!');
    //     }

    //     return redirect()->back()->withErrors([
    //         'email' => 'The provided credentials do not match our records.',
    //     ]);
    // }

    public function verifyEmail(EmailVerificationRequest $request)
    {
        $request->fulfill();

        return redirect('/')->with('success', 'Email Verified');
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255|exists:users',
        ]);
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $token = Str::random(60);
            DB::table('password_reset_tokens')->where('email', $user->email)->delete();
            DB::table('password_reset_tokens')->insert([
                'email' => $user->email,
                'token' => $token,
                'created_at' => now()
            ]);
            Mail::send('Mails.reset-password', ['token' => $token, 'email' => $user->email, 'name' => $user->name], function ($message) use ($request) {
                $message->to($request->email)->subject('Reset Password');
            });
        }
        return redirect('login')->with('success', 'Password Reset Link Sent. Please check your email');
    }

    public function newPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|min:8|confirmed',
        ]);
        $data = DB::table('password_reset_tokens')->where('token', $request->token)->first();
        if ($data) {
            User::where('email', $data->email)->update(['password' => bcrypt($request->password)]);
            DB::table('password_reset_tokens')->where('token', $request->token)->delete();
            return redirect('login')->with('success', 'Password Changed Successfully');
        } else {
            return redirect('forgot-password')->with('error', 'An Unexpected Error Occurred');
        }
    }

    public function confirmPassword(Request $request)
    {
        if (Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password
        ])) {
            $request->session()->put('auth.password_confirmed_at', time());
            return redirect()->intended(route('dashboard'))->with('success', 'Password Confirmed');
        }
        throw ValidationException::withMessages([
            'password' => [__('auth.password'),],
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->forget('user_id');
        $request->session()->forget('authenticated');
        $request->session()->forget('user_name');
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|max:25|min:5|unique:users',
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:8|confirmed',
            'profile_photo' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048|dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
        ]);

        $image = $request->file('profile_photo');
        // $image_name = bcrypt($request->username) . '.' . $image->getClientOriginalExtension();
        // $image->storeAs('public/profile_photo', $image_name);
        $name = uniqid('avatar_') . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs('avatars', $name);
        $user = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'profile_photo_path' => $path,
            'password' => bcrypt($request->password)
        ]);

        event(new Registered($user));
        Auth()->login($user);

        $request->session()->regenerate();
        $request->session()->put('user_id', $user->id);
        $request->session()->put('authenticated', true);
        $request->session()->put('user_name', $user->name);
        $user->update(['last_login_at' => now()]);

        return redirect('/')->with('success', 'Registration Successful. Welcome ' . $user->name . '!');
    }

    public function loginPage()
    {
        //return view('Auth.login');
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('forgot-password'),
            'status' => session('status'),
            'success' => session('success'),
            'error' => session('error'),
            'info' => session('info'),
        ]);
    }

    public function registerPage()
    {
        //return view('Auth.register');
        return Inertia::render('Auth/Register', [
            'status' => session('status'),
            'success' => session('success'),
            'error' => session('error'),
            'info' => session('info'),
        ]);
    }

    public function verifyEmailPage()
    {
        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
            'success' => session('success'),
            'error' => session('error'),
            'info' => session('info'),
        ]);
    }

    public function forgotPasswordPage()
    {
        //return view('Auth.forgotPassword');
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'success' => session('success'),
            'error' => session('error'),
            'info' => session('info'),
        ]);
    }

    public function newPasswordPage()
    {
        $token = $_GET['token'];
        //return view('Auth.newPassword', ['token' => $token]);
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
        ]);
    }

    public function confirmPasswordPage()
    {
        return Inertia::render('Auth/ConfirmPassword', [
            'status' => session('status'),
            'success' => session('success'),
            'error' => session('error'),
            'info' => session('info'),
        ]);
    }
}
