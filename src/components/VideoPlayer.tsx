"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoPlayerProps {
    id: string;
    url: string;
}

export default function VideoPlayer({ id, url }: VideoPlayerProps) {
    const hasViewedRef = useRef(false);

    useEffect(() => {
        if (!hasViewedRef.current) {
            fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, type: "view" }),
            });
            hasViewedRef.current = true;
        }
    }, [id]);

    const handleEnded = () => {
        fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, type: "complete" }),
        });
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <video
                    src={url}
                    controls
                    className="w-full aspect-video bg-black"
                    onEnded={handleEnded}
                />
            </CardContent>
        </Card>
    );
}
