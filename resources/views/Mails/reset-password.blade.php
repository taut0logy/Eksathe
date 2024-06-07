@extends('layout-main')

@section('title', 'Eksathe - Reset Password')



@section('content')
    <div class="bg-gray-100 flex flex-col items-center justify-center p-5">
        <h1 class=" text-3xl m-6 text-gray-700 font-bold">Eksathe</h1>
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full flex items-center justify-center flex-col">
            <h1 class="text-gray-700 text-xl font-bold mb-4 w-full">Hello {{ $name }},</h1>
            <p class="mb-5 text-gray-600">You requested a password reset. Please click the button below to reset your
                password.</p>
            <button
                class="bg-gray-800 hover:bg-gray-200 hover:text-gray-700 text-white font-bold py-2 px-4 rounded border-2 border-gray-800 focus:outline-none focus:shadow-outline"
                type="button">
                <a href="{{ route('new-password', ['token' => $token]) }}" class="">Reset Password</a>
            </button>
            <p class="mt-5 mb-2 text-gray-600">If you did not request a password reset, please ignore this email.</p>
            <div class="mt-5 w-full">
                <h3 class="text-gray-700 text-xl font-bold mb-4 w-full">Regards, </h3>
                <p class="text-gray-600">Eksathe Team</p>
            </div>
            <div class="mt-5 w-full border-b border-gray-300"></div>
            <div class="text-gray-500 text-xs mt-5 max-w-full">
                If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web
                browser:
                <a class="text-blue-500 hover:text-blue-700 underline max-w-full"
                    href="{{ route('new-password', ['token' => $token]) }}">
                    {{ route('new-password', ['token' => $token]) }}
                </a>
            </div>
        </div>
        <p class="text-gray-400 text-xs mt-10 mb-2">© 2024 Eksathe. All rights reserved.</p>
    </div>

@endsection
