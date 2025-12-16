import { useState, useRef } from "react";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

export function useFFmpeg() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ffmpegRef = useRef<FFmpeg | null>(null);

    const load = async () => {
        if (loaded) return;
        setIsLoading(true);
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

        try {
            const { FFmpeg } = await import("@ffmpeg/ffmpeg");
            const { toBlobURL } = await import("@ffmpeg/util");

            if (!ffmpegRef.current) {
                ffmpegRef.current = new FFmpeg();
            }
            const ffmpeg = ffmpegRef.current;

            ffmpeg.on("log", ({ message }) => {
                console.log(message);
            });

            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });
            setLoaded(true);
        } catch (error) {
            console.error("Failed to load ffmpeg", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        ffmpeg: ffmpegRef.current!,
        loaded,
        isLoading,
        load,
    };
}
