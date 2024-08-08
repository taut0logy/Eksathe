<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMesageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'body' => 'nullable|string',
            //'sender_id' => 'required|exists:users,id',
            'reply_to_id' => 'nullable|exists:messages,id',
            'server_id' => 'required_without:receiver_id|nullable|exists:servers,id',
            'receiver_id' => 'required_without:server_id|nullable|exists:users,id',
            'attachments' => 'nullable|array|max:10',
            'attachments.*' => 'file|max:102400',
        ];
    }
}
