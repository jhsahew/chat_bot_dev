"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { TranslatorSkeleton } from "./TranslatorSkeleton"
import { TranslatorResult } from "./TranslatorResult"
import type { TranslateResult } from "@/types"
import { Loader2, Sparkles, AlertCircle, Trash2 } from "lucide-react"

export function TranslatorForm() {
  const [inputText, setInputText] = React.useState("")
  const [tone, setTone] = React.useState("default")
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<TranslateResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const suggestions = [
    "Giải thích lỗi NullPointerException",
    "Lỗi Màn Hình Xanh (BSOD) là gì?",
    "Mô hình Neural Network hoạt động thế nào?",
    "Lỗi 404 Not Found",
  ]

  const handleClear = () => {
    setInputText("")
    setResult(null)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, tone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra trong quá trình thông dịch.")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full relative max-w-2xl group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex w-full flex-col space-y-4 rounded-lg bg-slate-900/80 p-4 ring-1 ring-slate-800 shadow-2xl backdrop-blur-sm">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Dán mã lỗi C++, thông số phần cứng, hay thuật ngữ AI vào đây..."
            className="border-none bg-transparent placeholder:text-slate-500 text-lg shadow-none focus-visible:ring-0 resize-y min-h-[160px]"
            disabled={isLoading}
          />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t border-slate-800/50 gap-4 sm:gap-0 mt-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-slate-400 whitespace-nowrap">Theo phong cách:</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={isLoading}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 outline-none transition-colors hover:border-slate-500"
              >
                <option value="default">🤓 Chuyên gia IT</option>
                <option value="genz">💅 Gen Z (Tóp Tóp)</option>
                <option value="toxic">🤬 Dev cọc cằn (Toxic)</option>
                <option value="grandma">👵 Bà ngoại hiền từ</option>
              </select>
            </div>

            <div className="flex gap-3 w-full sm:w-auto justify-end">
              {(inputText || result || error) && (
                <Button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 rounded-full px-6 transition-all"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Làm mới
                </Button>
              )}
            <Button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-500/50 rounded-full px-8 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang thông dịch...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-indigo-200" />
                  Thông dịch ngay
                </>
              )}
            </Button>
            </div>
          </div>
        </div>
      </form>

      {!inputText && !result && !isLoading && (
        <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-wider">Hoặc thử ngay các lỗi phổ biến</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl w-full">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(suggestion)}
                className="px-4 py-2 rounded-full border border-slate-800/60 bg-slate-900/40 text-slate-300 text-sm hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-200 transition-all duration-300 whitespace-nowrap backdrop-blur-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 flex items-center gap-2 text-rose-400 bg-rose-500/10 px-4 py-3 rounded-md w-full max-w-3xl border border-rose-500/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isLoading && <TranslatorSkeleton />}
      {result && <TranslatorResult result={result} />}
    </div>
  )
}
