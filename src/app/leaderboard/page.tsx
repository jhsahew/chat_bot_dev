import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Skull, Flame, AlertTriangle, ShieldAlert } from "lucide-react"

// Tạm thời dùng Mock Data tĩnh vì chưa có Database
const LEADERBOARD_DATA = [
  {
    id: 1,
    bugName: "DROP TABLE users; --",
    severity: 1000,
    author: "Thực tập sinh giấu tên",
    description: "Xóa sạch dữ liệu khách hàng. CEO khóc nghẹn phòng họp.",
    icon: Skull,
    color: "text-rose-500",
    bgClass: "bg-rose-500/10",
  },
  {
    id: 2,
    bugName: "CrowdStrike BSOD Global Outage",
    severity: 999,
    author: "Sensor Update",
    description: "Màn hình xanh toàn cầu. Hàng không, ngân hàng, y tế tê liệt.",
    icon: Flame,
    color: "text-orange-500",
    bgClass: "bg-orange-500/10",
  },
  {
    id: 3,
    bugName: "rm -rf /",
    severity: 980,
    author: "Senior buồn ngủ",
    description: "Xóa toàn bộ hệ điều hành máy chủ Linux. Sếp báo công an.",
    icon: ShieldAlert,
    color: "text-red-500",
    bgClass: "bg-red-500/10",
  },
  {
    id: 4,
    bugName: "Infinite Loop (Vòng lặp vô hạn)",
    severity: 850,
    author: "Dev thực tập",
    description: "Treo cứng máy chủ AWS, hóa đơn cuối tháng lên 2 tỷ đồng.",
    icon: Flame,
    color: "text-amber-500",
    bgClass: "bg-amber-500/10",
  },
  {
    id: 5,
    bugName: "Lộ API Key lên GitHub",
    severity: 800,
    author: "Hacker 'Hảo Hán'",
    description: "Trộm chạy đào coin bằng tài nguyên công ty.",
    icon: AlertTriangle,
    color: "text-yellow-500",
    bgClass: "bg-yellow-500/10",
  },
]

export default function LeaderboardPage() {
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
          <p className="text-slate-400 text-lg mt-2">
            Nơi vinh danh những mã lỗi mang sức công phá hủy diệt toàn hệ thống, với độ sát thương chấm trên thang 1000.
          </p>
        </div>

        <div className="space-y-4">
          {LEADERBOARD_DATA.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl hover:bg-slate-800/60 transition-colors shadow-lg"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`text-2xl font-black w-8 text-center ${index === 0 ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-700' : 'text-slate-600'}`}>
                  #{index + 1}
                </div>
                <div className={`p-4 rounded-xl shrink-0 ${item.bgClass} ${item.color}`}>
                  <item.icon className="h-8 w-8" />
                </div>
              </div>

              <div className="flex-1 px-2">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  {item.bugName}
                </h3>
                <p className="text-slate-400 text-sm mt-1 mb-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="text-xs font-mono text-slate-500">
                  Thủ phạm: <span className="text-slate-300">{item.author}</span>
                </div>
              </div>

              <div className="flex flex-col items-end sm:min-w-[120px]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Sát thương</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${item.color}`}>
                    {item.severity}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    /1000
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 text-center">
          <h3 className="text-slate-300 mb-2">Thấy mã code của mình ở đây chưa?</h3>
          <p className="text-slate-500 text-sm">Nếu ứng dụng của bạn chưa bao giờ sập, chứng tỏ là không ai xài nó cả. Đừng buồn!</p>
        </div>
      </div>
    </main>
  )
}
