import { useState, useRef, useCallback } from "react";

export function useMediaRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            const mediaRecorder = new MediaRecorder(stream, {
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
                stream.getTracks().forEach((track) => track.stop());
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
