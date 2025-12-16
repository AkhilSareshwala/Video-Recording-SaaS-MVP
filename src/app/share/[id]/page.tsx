import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import path from "path";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Download } from "lucide-react";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getVideo(id: string) {
    try {
        const dbPath = path.join(process.cwd(), "data", "videos.json");
        const dbData = await readFile(dbPath, "utf-8");
        const videos = JSON.parse(dbData);
        return videos.find((v: any) => v.id === id);
    } catch (error) {
        return null;
    }
}

export default async function SharePage({ params }: PageProps) {
    const { id } = await params;
    const video = await getVideo(id);

    if (!video) {
        notFound();
    }

    const videoUrl = `/uploads/${video.filename}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative w-full max-w-4xl space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Shared Video</h1>
                    <Link href="/">
                        <Button variant="outline" className="shadow-sm hover:shadow transition-all">Create New</Button>
                    </Link>
                </div>

                <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                    <div className="aspect-video bg-black relative">
                        <VideoPlayer id={video.id} url={videoUrl} />
                    </div>

                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Video ID</p>
                                <p className="font-mono text-lg font-semibold text-slate-900 dark:text-slate-50">{video.id}</p>
                                <p className="text-xs text-slate-400">
                                    Created on {new Date(video.createdAt).toLocaleDateString()} at {new Date(video.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                            <a href={videoUrl} download>
                                <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105">
                                    <Download className="w-5 h-5 mr-2" /> Download Video
                                </Button>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
