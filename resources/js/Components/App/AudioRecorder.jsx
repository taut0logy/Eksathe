import {MicrophoneIcon, StopCircleIcon} from '@heroicons/react/24/solid';
import {useState} from 'react';

export default function AudioRecorder({onRecorded}) {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);
    const recordAudio = async () => {
        if (recording) {
            setRecording(false);
            if(mediaRecorder) {
                console.log("stopping");
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                setMediaRecorder(null);
            }
            return;
        }
        try {
            setRecording(true);
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const newMediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
            newMediaRecorder.addEventListener('dataavailable', (event) => {
                audioChunks.push(event.data);
            });

            newMediaRecorder.addEventListener('stop', () => {
                let audioBlob = new Blob(audioChunks, {type: 'audio/ogg; codecs=opus'});
                let audioFile = new File([audioBlob], 'audio.ogg', {type: 'audio/ogg; codecs=opus'});
                let audioUrl = URL.createObjectURL(audioFile);
                console.log(audioFile);
                onRecorded(audioFile, audioUrl);
            });
            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);
            //console.log(mediaRecorder.state);
        } catch (e) {
            setRecording(false);
            console.error(e);
        }

    }

    return (
        <button className={"p-1 btn-ghost relative hover:text-primary rounded"}
            onClick={recordAudio}
        >
            {recording
            ? (<StopCircleIcon className='w-6 text-red-600'/>)
            : (<MicrophoneIcon className='w-6'/>)}
        </button>
    );
}


