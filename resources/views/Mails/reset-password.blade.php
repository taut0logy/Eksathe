@extends('layout-main')

@section('title','Eksathe - Reset Password')

@section('content')

    <div class="bg-gray-100 flex flex-col items-center justify-center h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full flex items-center justify-center  flex-col">
        <h1 class="text-xl font-bold mb-4 w-full">Hello {{ $name }},</h1>
        <p class="mb-5">You requested a password reset. Please click the button below to reset your password.</p>
        <button class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            <a href="{{ route('new-password', ['token' => $token])}}" class="btn btn-link">Reset Password</a>
        </button>
        <p class="mt-5 mb-2 text-gray-600">If you did not request a password reset, please ignore this email.</p>
        <div class="mt-5 w-full border-b border-gray-300"></div>
        <div class="text-gray-500 text-xs mt-5">
            <p>If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:<a
                    class="text-blue-500 hover:text-blue-700 underline"
                    href="{{ route('new-password', ['token' => $token])}}">{{ route('new-password', ['token' => $token])}}</a>
            </p>

        </div>
    </div>
        <p class="text-gray-400 text-xs mt-10">© 2024 Eksathe. All rights reserved.</p>
    </div>

@endsection
