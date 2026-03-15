import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { text, tone = "default" } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp nội dung để thông dịch." },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY

    // Dùng Mock Data nếu USER chưa điền key (để test UI Bước 5)
    if (!apiKey || apiKey.trim() === "") {
      // Giả lập delay 1.5s
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({
        severity: 999,
        whatIsHappening: "Chương trình cố truy cập vùng nhớ cấm. Hệ điều hành 'tuýt còi' văng lỗi Segmentation Fault.",
        metaphor: "Như bạn cầm chìa khóa phòng khách sạn đi mở cửa phòng giám đốc, bảo vệ đè cổ đá ra ngoài.",
        actionableAdvice: "Kiểm tra vòng lặp có vượt mảng không. Đảm bảo con trỏ không trỏ vào null.",
        excuseToBoss: "Do máy trạm bị tràn bộ nhớ vật lý ngẫu nhiên sếp ạ, để em cấp phát lại vùng nhớ an toàn là xong ngay."
      }, { status: 200 })
    }

    const ai = new GoogleGenAI({ apiKey })

    let personaInstruction = "Bạn là chuyên gia IT nhiệt tình giải thích cho người mới."
    if (tone === "genz") {
      personaInstruction = "Bạn là một Gen Z chính hiệu, hay dùng từ lóng mạng xã hội, meme, flexing. Giải thích cực kỳ hài hước, đôi khi hơi 'khịa' sự gà mờ của người dùng nhưng vẫn giúp họ."
    } else if (tone === "toxic") {
      personaInstruction = "Bạn là một Senior Developer khó tính, hay cọc cằn và toxic nhẹ kiểu 'máy dập bàn phím'. Luôn tỏ ra cạn lời với lỗi của người dùng, nhưng chửi xong thì vẫn chỉ cách sửa tận tình."
    } else if (tone === "grandma") {
      personaInstruction = "Bạn là một người bà lớn tuổi, hiền từ đang cố gắng dùng chuyện bếp núc, làm vườn, chợ búa để giải thích công nghệ cho cháu ngoan."
    }

    const systemInstruction = `
    ${personaInstruction}
    Luôn dùng phép so sánh đời sống hoặc theo đúng phong cách đóng vai. Không dùng từ hàn lâm.
    ĐẶC BIỆT LƯU Ý: Trả lời thật ngắn gọn, súc tích ("chắt chiu" câu chữ, tối đa 2-3 câu mỗi phần).
    Trả về ĐÚNG 5 phần dưới dạng JSON (đảm bảo nó là JSON hợp lệ):
    {
      "severity": 1, // Đánh giá mức độ nghiêm trọng bằng một con số từ 1 đến 1000 (Ví dụ: 1000 là bay màu server, 10 là mỏi tay xíu)
      "whatIsHappening": "Chuyện gì đang xảy ra...",
      "metaphor": "Tưởng tượng thế này cho dễ hiểu...",
      "actionableAdvice": "Lời khuyên / Cách xử lý (Nhớ giữ đúng phong cách nhân vật)...",
      "excuseToBoss": "Viết 1 câu lý do kỹ thuật cực kỳ 'thuyết phục' nhưng hơi lươn lẹo để dev copy gửi báo cáo sếp/khách hàng giải thích tại sao tính năng chết (giữ phong cách lươn lẹo nhẹ nhàng vui vẻ)..."
    }
    Chỉ trả về JSON, không bao bọc bằng markdown, không thêm văn bản giải thích.
    `

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    })

    let responseText = response.text || ""

    // Xóa bỏ các markdown code block nếu Gemini tự động thêm vào
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```/, "").replace(/```$/, "").trim();
    }

    try {
      const parsedData = JSON.parse(responseText)

      // LƯU VÀO DATABASE (Chạy ngầm, không đợi để tránh làm chậm UX)
      // Nhưng ở đây mình dùng prisma để lưu thật
      try {
        await prisma.bugTranslation.create({
          data: {
            bugName: text.substring(0, 100), // Lấy tag lỗi làm tên
            severity: parsedData.severity || 0,
            description: parsedData.whatIsHappening,
            actionableAdvice: parsedData.actionableAdvice,
            metaphor: parsedData.metaphor,
            excuseToBoss: parsedData.excuseToBoss,
            tone: tone,
          }
        })
      } catch (dbError) {
        console.error("Lỗi lưu Database:", dbError)
        // Vẫn tiếp tục trả về kết quả cho user dù DB lỗi
      }

      return NextResponse.json(parsedData, { status: 200 })
    } catch (parseError) {
      console.error("Lỗi khi parse JSON từ Gemini:", responseText)
      return NextResponse.json(
        { error: "Kết quả trả về không đúng định dạng. Vui lòng thử lại." },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error)
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra lỗi hệ thống." },
      { status: 500 }
    )
  }
}
