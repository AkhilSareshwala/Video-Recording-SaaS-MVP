"use client";

import { useState, useEffect, useRef } from "react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { fetchFile } from "@ffmpeg/util";
import { Loader2, Upload, Scissors, Video, Play, Square } from "lucide-react";

const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
};

export default function VideoEditor() {
    const { isRecording, mediaBlob, startRecording, stopRecording, setMediaBlob } = useMediaRecorder();
    const { ffmpeg, loaded, load, isLoading: isFFmpegLoading } = useFFmpeg();

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
    const [startTime, setStartTime] = useState("00:00:00");
    const [endTime, setEndTime] = useState("00:00:10");
    const [isTrimming, setIsTrimming] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadUrl, setUploadUrl] = useState<string | null>(null);
    const [copyText, setCopyText] = useState("Copy");

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (mediaBlob) {
            const url = URL.createObjectURL(mediaBlob);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [mediaBlob]);

    const handleTrim = async () => {
        if (!loaded || !mediaBlob) return;
        setIsTrimming(true);

        try {
            const inputName = "input.webm";
            const outputName = "output.webm";

            await ffmpeg.writeFile(inputName, await fetchFile(mediaBlob));

            // ffmpeg -i input.webm -ss 00:00:00 -to 00:00:10 -c copy output.webm
            await ffmpeg.exec([
                "-i", inputName,
                "-ss", startTime,
                "-to", endTime,
                "-c", "copy",
                outputName
            ]);

            const data = await ffmpeg.readFile(outputName);
            const blob = new Blob([data as any], { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setTrimmedUrl(url);
            setMediaBlob(blob); // Update main blob to trimmed version
        } catch (error) {
            console.error("Error trimming video:", error);
        } finally {
            setIsTrimming(false);
        }
    };

    const handleUpload = async () => {
        if (!mediaBlob) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", mediaBlob, "video.webm");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setUploadUrl(`${window.location.origin}/share/${data.id}`);
        } catch (error) {
            console.error("Error uploading video:", error);
            alert("Failed to upload video");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ring-1 ring-slate-900/5">
                        {videoUrl ? (
                            <video
                                src={videoUrl}
                                controls
                                className="w-full h-full object-cover"
                                onLoadedMetadata={(e) => {
                                    const duration = e.currentTarget.duration;
                                    setEndTime(formatTime(duration));
                                }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4 bg-slate-50/5 dark:bg-slate-900/50 backdrop-blur-sm">
                                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                                    <Video className="w-8 h-8 opacity-50" />
                                </div>
                                <p className="font-medium">Ready to record</p>
                            </div>
                        )}

                        {isRecording && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/90 text-white text-xs font-medium rounded-full animate-pulse shadow-lg backdrop-blur-sm">
                                <div className="w-2 h-2 bg-white rounded-full" />
                                Recording
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        {!isRecording ? (
                            <Button onClick={startRecording} size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105">
                                <Play className="w-5 h-5 mr-2 fill-current" /> Start Recording
                            </Button>
                        ) : (
                            <Button onClick={stopRecording} variant="destructive" size="lg" className="rounded-full px-8 shadow-xl shadow-destructive/20 hover:shadow-destructive/40 transition-all hover:scale-105">
                                <Square className="w-5 h-5 mr-2 fill-current" /> Stop Recording
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {videoUrl ? (
                        <Card className="border-0 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Scissors className="w-5 h-5 text-primary" /> Editor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Time</label>
                                        <Input
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="font-mono text-center text-lg tracking-widest bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">End Time</label>
                                        <Input
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="font-mono text-center text-lg tracking-widest bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                </div>

                                <Button onClick={handleTrim} disabled={!loaded || isTrimming} className="w-full" size="lg" variant="secondary">
                                    {isTrimming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Scissors className="w-4 h-4 mr-2" />}
                                    Trim Video
                                </Button>

                                {!loaded && <p className="text-xs text-center text-muted-foreground animate-pulse">Initializing processing engine...</p>}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3 pt-2">
                                <Button onClick={handleUpload} disabled={!mediaBlob || isUploading} className="w-full shadow-lg shadow-primary/20" size="lg">
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" /> Upload & Share
                                        </>
                                    )}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => {
                                    setVideoUrl(null);
                                    setMediaBlob(null);
                                    setTrimmedUrl(null);
                                    setUploadUrl(null);
                                }} className="w-full text-muted-foreground hover:text-foreground">
                                    Start Over
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/50 h-full flex items-center justify-center p-8 text-center text-muted-foreground">
                            <div className="space-y-2">
                                <p>Record a video to unlock editing tools</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {uploadUrl && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <Card className="bg-slate-900 text-slate-50 border-slate-800 shadow-2xl">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                <Upload className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{uploadUrl}</p>
                                <p className="text-xs text-slate-400">Video published successfully</p>
                            </div>
                            <Button size="sm" variant="secondary" onClick={() => {
                                if (uploadUrl) {
                                    navigator.clipboard.writeText(uploadUrl);
                                    setCopyText("Copied!");
                                    setTimeout(() => setCopyText("Copy"), 2000);
                                }
                            }} className="shrink-0 min-w-[80px]">
                                {copyText}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
