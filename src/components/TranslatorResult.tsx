"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import type { TranslateResult } from "@/types"
import { Target, Lightbulb, Wrench, Copy, Check, Volume2, VolumeX, Share2, MessageCircle, AlertTriangle } from "lucide-react"

export function TranslatorResult({ result }: { result: TranslateResult }) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)
  const [copiedAll, setCopiedAll] = React.useState(false)
  const [speakingIndex, setSpeakingIndex] = React.useState<number | null>(null)

  const copyToClipboard = (text: string, idx: number | "all") => {
    navigator.clipboard.writeText(text)
    if (idx === "all") {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } else {
      setCopiedIndex(idx)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
  }

  const handleSpeak = (text: string, idx: number) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (speakingIndex === idx) {
        window.speechSynthesis.cancel();
        setSpeakingIndex(null);
        return;
      }
      
      window.speechSynthesis.cancel(); // Dừng nếu đang đọc câu khác
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN"; // Chọn giọng Tiếng Việt
      utterance.rate = 1.0;
      
      utterance.onend = () => {
        setSpeakingIndex(null);
      };
      
      setSpeakingIndex(idx);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ tính năng đọc giọng nói.");
    }
  }

  // Dừng nói khi component bị hủy
  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, []);

  const sections = [
    {
      title: "Chuyện gì đang xảy ra?",
      content: result.whatIsHappening,
      icon: Target,
      color: "text-rose-400",
      bgClass: "bg-rose-500/10",
      borderClass: "border-rose-500/20",
    },
    {
      title: "Tưởng tượng thế này cho dễ hiểu:",
      content: result.metaphor,
      icon: Lightbulb,
      color: "text-amber-400",
      bgClass: "bg-amber-500/10",
      borderClass: "border-amber-500/20",
    },
    {
      title: "Lời khuyên / Cách xử lý:",
      content: result.actionableAdvice,
      icon: Wrench,
      color: "text-emerald-400",
      bgClass: "bg-emerald-500/10",
      borderClass: "border-emerald-500/20",
    },
    {
      title: "Lý do báo cáo sếp / KH (Copy ngay):",
      content: result.excuseToBoss,
      icon: MessageCircle,
      color: "text-purple-400",
      bgClass: "bg-purple-500/10",
      borderClass: "border-purple-500/20",
    },
  ]

  return (
    <div className="flex flex-col gap-6 mt-8 w-full max-w-3xl mx-auto">
      
      {/* SEVERITY METER (THANH ĐO SÁT THƯƠNG) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="flex items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md relative overflow-hidden">
          {/* Background Highlight effect */}
          <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none ${result.severity > 700 ? 'bg-rose-500' : result.severity > 400 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>

          <div className="flex flex-col flex-1 pl-2 relative z-10">
            <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Máy đo mức độ "Sát thương" của lỗi</span>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 bg-slate-950/80 rounded-full overflow-hidden shadow-inner border border-slate-800/50">
                <div 
                  className={`h-full rounded-full transition-all duration-1500 ease-out relative ${result.severity > 700 ? 'bg-gradient-to-r from-rose-600 to-rose-400' : result.severity > 400 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                  style={{ width: `${Math.min((result.severity / 1000) * 100, 100)}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent"></div>
                </div>
              </div>
              <span className="text-2xl font-extrabold font-mono min-w-[64px] text-right text-slate-100">
                {result.severity}<span className="text-slate-500 text-lg">/1000</span>
              </span>
            </div>
          </div>
          <AlertTriangle className={`h-10 w-10 shrink-0 relative z-10 ${result.severity > 700 ? 'text-rose-500 animate-pulse' : result.severity > 400 ? 'text-amber-500' : 'text-emerald-500'}`} />
        </div>
      </motion.div>
      {sections.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.15 }}
        >
          <Card className={`p-6 overflow-hidden relative group transition-colors hover:bg-slate-900/60 ${section.borderClass}`}>
            <div className="flex gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${section.bgClass} ${section.color}`}
              >
                <section.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 pr-10">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {section.title}
                </h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all focus-within:opacity-100 disabled:opacity-100">
              <button
                onClick={() => handleSpeak(section.content, idx)}
                className="p-2 rounded-md bg-slate-800/50 hover:bg-slate-700/80 text-sky-400 hover:text-sky-300 transition-all"
                title={speakingIndex === idx ? "Dừng đọc" : "Đọc nội dung"}
              >
                {speakingIndex === idx ? (
                  <VolumeX className="h-4 w-4 animate-pulse" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(section.content, idx)}
                className="p-2 rounded-md bg-slate-800/50 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-all"
                title="Sao chép phần này"
              >
                {copiedIndex === idx ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </Card>
        </motion.div>
      ))}

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.6 }}
        className="flex justify-center mt-2"
      >
        <button
          onClick={() => {
            const fullText = `💡 GIẢI THÍCH CÔNG NGHỆ (Từ Tech Translator) 💡\n\n🚨 Mức độ sát thương: ${result.severity}/1000 LHP\n\n🎯 Chuyện gì đang xảy ra?\n${result.whatIsHappening}\n\n🧠 Tưởng tượng thế này:\n${result.metaphor}\n\n🛠️ Lời khuyên:\n${result.actionableAdvice}\n\n👔 Lời biện hộ gửi sếp:\n"${result.excuseToBoss}"\n\n--- Dịch bởi Tech Translator ---`;
            if (navigator.share) {
              navigator.share({
                title: 'Tech Translator',
                text: fullText,
              }).catch(() => copyToClipboard(fullText, "all"));
            } else {
              copyToClipboard(fullText, "all");
            }
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-800/40 border border-slate-700/50 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-200 hover:border-indigo-500/30 transition-all text-sm font-medium"
        >
          {copiedAll ? (
            <><Check className="h-4 w-4 text-emerald-400" /> Đã chép toàn bộ kết quả!</>
          ) : (
            <><Share2 className="h-4 w-4" /> Sao chép / Chia sẻ toàn bộ kết quả</>
          )}
        </button>
      </motion.div>
    </div>
  )
}
