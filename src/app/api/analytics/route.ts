import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        const { id, type } = await request.json();

        if (!id || !type) {
            return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
        }

        const dbPath = path.join(process.cwd(), "data", "videos.json");
        const dbData = await readFile(dbPath, "utf-8");
        const videos = JSON.parse(dbData);

        const videoIndex = videos.findIndex((v: any) => v.id === id);
        if (videoIndex === -1) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        if (type === "view") {
            videos[videoIndex].views = (videos[videoIndex].views || 0) + 1;
        } else if (type === "complete") {
            videos[videoIndex].completions = (videos[videoIndex].completions || 0) + 1;
        }

        await writeFile(dbPath, JSON.stringify(videos, null, 2));

        return NextResponse.json({ success: true, stats: videos[videoIndex] });
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ error: "Analytics failed" }, { status: 500 });
    }
}
