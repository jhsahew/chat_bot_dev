import * as React from "react"
import Link from "next/link"
import { TranslatorForm } from "@/components/TranslatorForm"
import { Trophy } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-slate-950 text-slate-50 overflow-hidden relative selection:bg-indigo-500/30">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="z-10 w-full max-w-5xl flex flex-col items-center font-mono">
        <div className="text-center space-y-4 mb-10 relative">
          <div className="absolute -inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent h-px" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 pb-2">
            Tech Translator
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-sans max-w-2xl font-light">
            Biểu diễn Công nghệ bằng Ngôn ngữ Đời thường. Giúp bạn hiểu mọi thuật ngữ khó nhằn.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/leaderboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 hover:scale-105 transition-all text-sm font-semibold tracking-wide">
              <Trophy className="h-4 w-4" /> Bảng Xếp Hạng Lỗi Nặng Nhất
            </Link>
          </div>
        </div>

        <div className="w-full flex-1">
          <TranslatorForm />
        </div>
      </div>
    </main>
  )
}
