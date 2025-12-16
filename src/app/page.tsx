import VideoEditor from "@/components/VideoEditor";
import { Video, Zap, Share2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
            v1.0 Public Beta
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Video Recording <span className="text-primary">Reimagined</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Capture, trim, and share your screen instantly. No software to install, no account required.
            Professional grade tools right in your browser.
          </p>

          <div className="flex justify-center gap-8 pt-4 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" /> HD Recording
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Instant Trim
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4" /> One-Click Share
            </div>
          </div>
        </div>

        <VideoEditor />
      </div>
    </main>
  );
}
