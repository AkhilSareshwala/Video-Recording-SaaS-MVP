import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const id = nanoid(10);
        const filename = `${id}.webm`;

        // Save to public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Update videos.json
        const dbPath = path.join(process.cwd(), "data", "videos.json");
        const dbData = await readFile(dbPath, "utf-8");
        const videos = JSON.parse(dbData);

        const newVideo = {
            id,
            filename,
            createdAt: new Date().toISOString(),
            views: 0,
            completions: 0
        };

        videos.push(newVideo);
        await writeFile(dbPath, JSON.stringify(videos, null, 2));

        return NextResponse.json({ id, url: `/uploads/${filename}` });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
