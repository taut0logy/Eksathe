<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class initiate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'initiate {port=8000} {--dev}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start the Laravel development server, Reverb server, and optionally run npm dev';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $port = $this->argument('port');
        $dev = $this->option('dev');

        // Start Laravel development server
        $this->info("Starting Laravel development server on port {$port}...");
        $laravelServeProcess = new Process(['php', 'artisan', 'serve', '--port=' . $port]);
        $laravelServeProcess->setTimeout(null);
        $laravelServeProcess->start();

        // Start Reverb server
        $this->info("Starting Reverb server...");
        $reverbServerProcess = new Process(['php', 'artisan', 'reverb:start']);
        $reverbServerProcess->setTimeout(null);
        $reverbServerProcess->start();

        // Optionally run npm dev
        $npmDevProcess = null;
        if ($dev) {
            $this->info("Running npm run dev...");
            $npmDevProcess = new Process(['npm', 'run', 'dev']);
            $npmDevProcess->setTimeout(null);
            $npmDevProcess->start();
        }

        // Monitor and output the processes' output
        $processes = [$laravelServeProcess, $reverbServerProcess];
        if ($dev) {
            $processes[] = $npmDevProcess;
        }

        foreach ($processes as $process) {
            if ($process) {
                $process->wait(function ($type, $buffer) {
                    if (Process::ERR === $type) {
                        $this->error($buffer);
                    } else {
                        $this->info($buffer);
                    }
                });
            }
        }

        return 0;
    }
}
