# Video SaaS MVP

A browser-based video recording, trimming, and sharing platform built with Next.js 14.

## Overview

This project is a Minimum Viable Product (MVP) for a SaaS application that allows users to:
1.  **Record** screen and audio directly in the browser.
2.  **Trim** the recorded video client-side using WebAssembly.
3.  **Upload** and **Share** the video via a public link.
4.  **Track** basic analytics (views and completion rates).

## Features

-   **Browser-based Recording**: Uses the MediaStream Recording API to capture screen and audio.
-   **Client-side Processing**: Leverages `ffmpeg.wasm` to trim videos without server-side processing costs.
-   **Instant Sharing**: Generates unique, shareable links immediately after upload.
-   **Analytics**: Tracks video views and full watch completions.
-   **Modern UI**: Built with Tailwind CSS and Radix UI primitives for a clean, accessible interface.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Video Processing**: ffmpeg.wasm (@ffmpeg/ffmpeg, @ffmpeg/util)
-   **Icons**: Lucide React
-   **Utilities**: clsx, tailwind-merge, nanoid

## Setup Instructions

1.  **Prerequisites**: Node.js 18+ installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Open Browser**: Navigate to `http://localhost:3000`.

## Architecture Decisions

### Client-Side Processing
We chose `ffmpeg.wasm` to offload video processing to the client. This reduces server costs significantly and improves privacy as raw footage doesn't leave the user's device until they choose to upload.

### Local Storage (MVP)
For this MVP, uploaded videos are stored in the `public/uploads` directory and metadata in `data/videos.json`. In a production environment, this would be replaced by object storage (AWS S3) and a proper database (PostgreSQL/MongoDB).

### Next.js App Router
Utilized for its robust routing, API handling, and server-side rendering capabilities, ensuring fast initial loads for the sharing pages.

## Limitations of MVP

-   **Persistence**: Data is stored in local JSON files. Redeploying or restarting in some environments may wipe data.
-   **Browser Support**: `ffmpeg.wasm` requires `SharedArrayBuffer` support, which needs specific security headers (`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`). This may limit embedding capabilities.
-   **File Size**: Large video files may impact browser performance during processing.

## Future Improvements

1.  **Cloud Storage**: Migrate to AWS S3 or R2 for scalable video storage.
2.  **Database**: Implement a proper database (Postgres) with Prisma/Drizzle.
3.  **Authentication**: Add user accounts (Clerk/NextAuth) to manage recordings.
4.  **Transcoding**: Implement server-side transcoding for adaptive bitrate streaming (HLS).
5.  **CDN**: Serve videos via a CDN for global performance.


