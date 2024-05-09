<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Server;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'raufun',
            'name' => 'Raufun Ahsan',
            'email' => 'raufun.ahsan@gmail.com',
            'password' => bcrypt('12121212'),
            'is_admin' => true
        ]);

        User::factory()->create([
            'username' => 'johnDoe',
            'name' => 'John Doe',
            'email' => 'doedoe@gmail.com',
            'password' => bcrypt('12121212'),
        ]);

        User::factory(10)->create();

        for ($i = 1; $i < 6; $i++) {
            $server = Server::factory()->create([
                'owner_id' => 1,
                'name' => 'Server ' . $i
            ]);

            $users = User::inRandomOrder()->limit(rand(2, 5))->pluck('id');
            $server->users()->attach(array_unique([1, ...$users]));
        }
        Message::factory(1000)->create();

        $serverMessages = Message::whereNotNull('server_id')->orderByDesc('created_at');

        $done=[];

        foreach ($serverMessages->get() as $message) {
            if(in_array($message->server_id, $done)) {
                continue;
            }
            $server = Server::find($message->server_id);
            $server->update(['last_message_id' => $message->id]);
            $done[] = $message->server_id;
        }

        $messages = Message::whereNull('server_id')->orderBy('created_at')->get();

        $conversations = $messages->groupBy(function ($message) {
            return collect([$message->sender_id, $message->receiver_id])->sort()->implode('_');
        })->map(function ($messages) {
            return [
                'user_id_1' => $messages->first()->sender_id,
                'user_id_2' => $messages->first()->receiver_id,
                'last_message_id' => $messages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());
    }
}
