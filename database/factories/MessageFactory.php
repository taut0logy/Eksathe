<?php

namespace Database\Factories;

use App\Models\Server;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $senderId = $this->faker->numberBetween(0, 1);
        if($senderId === 0) {
            $senderId = $this->faker->randomElement(User::where('id', '!=', 1)->pluck('id')->toArray());
            $receiverId=1;
        } else {
            $receiverId = $this->faker->randomElement(User::pluck('id')->toArray());
        }

        $serverId = null;
        if($this->faker->boolean(50)) {
            $serverId = $this->faker->randomElement(Server::pluck('id')->toArray());
            $server=Server::find($serverId);
            $senderId=$this->faker->randomElement($server->users->pluck('id')->toArray());
            $receiverI=null;
        }

        return [
            //
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'server_id' => $serverId,
            'body' => $this->faker->realText(200),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
