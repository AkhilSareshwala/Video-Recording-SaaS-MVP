import { useState, useRef, useCallback } from "react";

export function useMediaRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = useCallback(async () => {
        try {
            // 1. Get Screen Stream (Video + System Audio)
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true, // Request system audio
            });

            // 2. Get Microphone Stream
            let micStream: MediaStream | null = null;
            try {
                micStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100,
                    },
                });
            } catch (err) {
                console.warn("Microphone access denied or not available:", err);
            }

            // 3. Combine Streams
            const tracks = [
                ...screenStream.getVideoTracks(),
            ];

            // Handle Audio Mixing if both sources exist
            const audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();
            let hasAudio = false;

            if (screenStream.getAudioTracks().length > 0) {
                const screenSource = audioContext.createMediaStreamSource(screenStream);
                const screenGain = audioContext.createGain();
                screenGain.gain.value = 1.0;
                screenSource.connect(screenGain).connect(destination);
                hasAudio = true;
            }

            if (micStream && micStream.getAudioTracks().length > 0) {
                const micSource = audioContext.createMediaStreamSource(micStream);
                const micGain = audioContext.createGain();
                micGain.gain.value = 1.0; // Adjust mic volume if needed
                micSource.connect(micGain).connect(destination);
                hasAudio = true;
            }

            if (hasAudio) {
                tracks.push(...destination.stream.getAudioTracks());
            } else {
                // Fallback if Web Audio API fails or no audio, just try to add raw tracks (though mixing is preferred)
                if (micStream) tracks.push(...micStream.getAudioTracks());
                if (screenStream.getAudioTracks().length > 0) tracks.push(...screenStream.getAudioTracks());
            }

            // If we used Web Audio API, the tracks are already in 'tracks' from destination.stream
            // But wait, if we didn't use Web Audio API (e.g. no audio context support?), we fallback. 
            // Actually AudioContext is widely supported. The fallback above adds duplicates if hasAudio is true.
            // Let's simplify: Always use destination stream if we have any audio.

            const combinedStream = new MediaStream(tracks);
            streamRef.current = combinedStream;

            // 4. Start Recording
            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: "video/webm; codecs=vp9",
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                setMediaBlob(blob);
                setIsRecording(false);

                // Stop all tracks
                combinedStream.getTracks().forEach(track => track.stop());
                screenStream.getTracks().forEach(track => track.stop());
                if (micStream) micStream.getTracks().forEach(track => track.stop());
                audioContext.close();
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    }, [isRecording]);

    return {
        isRecording,
        mediaBlob,
        startRecording,
        stopRecording,
        setMediaBlob,
    };
}
