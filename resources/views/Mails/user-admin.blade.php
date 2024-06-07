@extends('layout-main')

@section('title','Eksathe - '. $title)

@section('content')

    <div class="bg-gray-100 flex flex-col items-center justify-center p-5">
        <h1 class=" text-3xl m-6 text-gray-700 font-bold">Eksathe</h1>
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full flex items-center justify-center  flex-col">
        <h1 class="text-gray-700 text-xl font-bold mb-4 w-full">Hello {{ $user->name }},</h1>
        <p class="mb-5 {{ $user->is_admin ? 'text-green-700' : 'text-red-700' }}">
        {{
            $user->is_admin ? 'Congratulations! You are now a system admin. You can now access admin features.' :
            'We are sorry to inform you that you are no longer a system admin. You will not be able to access admin features.'
         }}
         </p>

         <button class="bg-gray-800 hover:bg-gray-200 hover:text-gray-700 text-white font-bold py-2 px-4 rounded border-2 border-gray-800 focus:outline-none focus:shadow-outline" type="button">
            <a href="{{ route('login')}}" class="">Log in</a>
        </button>

        <p class="mt-5 mb-2 text-gray-600 w-full">If you have any queries, please contact an admin.</p>

        <div class="mt-5 w-full">
            <h3 class="text-gray-700 text-xl font-bold mb-4 w-full">Regards, </h3>
            <p class="text-gray-600">Eksathe Team</p>
        </div>
    </div>
        <p class="text-gray-400 text-xs mt-10 mb-2">© 2024 Eksathe. All rights reserved.</p>
    </div>

@endsection
