import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Skull, Flame, AlertTriangle, ShieldAlert, Ghost, Info } from "lucide-react"
import { prisma } from "@/lib/prisma"

// Ép trang này luôn lấy data mới nhất (không dùng cache cũ)
export const revalidate = 0;

export default async function LeaderboardPage() {
  let leaderboardData = [];
  
  try {
    // Lấy top 10 lỗi có điểm sát thương cao nhất
    leaderboardData = await prisma.bugTranslation.findMany({
      orderBy: {
        severity: 'desc'
      },
      take: 10
    });
  } catch (error) {
    console.error("Lỗi lấy dữ liệu Leaderboard:", error);
  }

  const getIcon = (severity: number, index: number) => {
    if (index === 0 || severity > 900) return Skull;
    if (severity > 700) return ShieldAlert;
    if (severity > 400) return Flame;
    return AlertTriangle;
  };

  const getColor = (severity: number) => {
    if (severity > 800) return "text-rose-500";
    if (severity > 500) return "text-orange-500";
    if (severity > 300) return "text-amber-500";
    return "text-yellow-500";
  };

  const getBg = (severity: number) => {
    if (severity > 800) return "bg-rose-500/10";
    if (severity > 500) return "bg-orange-500/10";
    if (severity > 300) return "bg-amber-500/10";
    return "bg-yellow-500/10";
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-br from-rose-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Về trang chủ dịch lỗi
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 pb-2">
            Bảng Phong Thần
          </h1>
          <p className="text-slate-400 text-lg mt-2 font-light">
            Nơi vinh danh những mã lỗi mang sức công phá hủy diệt toàn hệ thống, dữ liệu được cập nhật dựa trên lượt dùng thực tế.
          </p>
        </div>

        {leaderboardData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
            <Ghost className="h-16 w-16 text-slate-700 mb-4 animate-bounce" />
            <p className="text-slate-500 text-lg">Chưa có "chiến tích" nào được ghi lại...</p>
            <p className="text-slate-600 text-sm mt-2">Hãy quay lại trang chủ và tạo ra vụ nổ đầu tiên!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboardData.map((item, index) => {
              const Icon = getIcon(item.severity, index);
              const colorClass = getColor(item.severity);
              const bgClass = getBg(item.severity);

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl hover:bg-slate-800/60 transition-all shadow-lg group hover:border-slate-700"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`text-2xl font-black w-8 text-center ${index === 0 ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-700' : 'text-slate-600'}`}>
                      #{index + 1}
                    </div>
                    <div className={`p-4 rounded-xl shrink-0 ${bgClass} ${colorClass} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="flex-1 px-2">
                    <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 truncate max-w-[300px]" title={item.bugName}>
                      {item.bugName}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 mb-2 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                      <span>Bởi: <span className="text-slate-300">{item.author}</span></span>
                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                      <span>Tone: <span className="text-indigo-400 uppercase">{item.tone}</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end sm:min-w-[120px]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Sát thương</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-black ${colorClass}`}>
                        {item.severity}
                      </span>
                      <span className="text-sm font-bold text-slate-500">
                        /1000
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-12 p-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 text-center">
          <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-4">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-slate-300 mb-2 font-semibold">Dữ liệu này từ đâu ra?</h3>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            Mỗi khi có ai đó dùng công cụ này để thông dịch một lỗi thật, hệ thống AI sẽ chấm điểm và lưu vào Bảng Phong Thần này để vinh danh những pha "tự hủy" đỉnh cao nhất.
          </p>
        </div>
      </div>
    </main>
  )
}
