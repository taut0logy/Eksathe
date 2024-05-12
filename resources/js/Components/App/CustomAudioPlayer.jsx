import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import React, {useState, useRef} from "react";

export default function CustomAudioPlayer ({file, showVolume=true}) {
    const audioRef=useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            setDuration(audio.duration);
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
        audioRef.current.volume = e.target.value;
    }

    const handleTimeUpdate = (e) => {
        const audio = audioRef.current;
        setProgress(audio.duration);
        setProgress(audio.currentTime);
    }

    const handleLoadedMetadata = (e) => {
        setDuration(audioRef.current.duration);
    }

    const handleSeek = (e) => {
        //const seekTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
        const seekTime = e.target.value;
        audioRef.current.currentTime = seekTime;
        setProgress(seekTime);
    }




    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-primary">
            <audio src={file.url}
            ref={audioRef}
            controls
            onTimeUpdateCapture={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="hidden"
            />
            <button onClick={togglePlay}>
                {isPlaying ? (
                    <PauseCircleIcon className="w-8 h-8 text-accent" />
                ) : (
                    <PlayCircleIcon className="w-8 h-8 text-accent" />
                )}
            </button>
                {
                    showVolume && (
                        <input type="range" min={"0"} max={"1"} step={"0.01"} value={"volume"} onChange={handleVolumeChange} />
                )}
                <input type="range" min={"0"} max={duration} step={"0.01"} value={progress} onChange={handleSeek} className="flex-1" />
        </div>

    )
}
