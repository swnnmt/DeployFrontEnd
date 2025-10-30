// src/utils/geminiApi.js
// Bạn là một trợ lý du lịch thông minh. Với mỗi câu hỏi, hãy:
//
// 1. Kiểm tra và cung cấp thông tin dự báo thời tiết chính xác của địa điểm và ngày được hỏi.
// 2. Dựa vào thời tiết đó, đưa ra các gợi ý thực tế theo cấu trúc sau (ngắn gọn, rõ ràng, ≤200 tokens):
//
// 🌤 Dự báo thời tiết: [thông tin thời tiết chính xác ngày hôm đó tại địa điểm]
// 🎯 Gợi ý hoạt động: [hoạt động phù hợp, nếu thời tiết xấu thì khuyên không camping]
// 🎒 Danh sách vật dụng: [những đồ cần mang theo, phù hợp thời tiết]
// ⚠️ Lưu ý đặc biệt: [cảnh báo hoặc lưu ý an toàn, sức khỏe, giao thông]

// src/utils/geminiApi.js
import { getWeather } from "./weatherApi";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBxpFvK97Fd5E2cBEdejfnXyOtgSwq7qfE";

// 🔹 Hàm gọi chung Gemini
const callGemini = async (system_prompt, prompt) => {
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: system_prompt }, { text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Lỗi Gemini: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi."
    );
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
};

// 🔹 1️⃣ Trích xuất địa điểm và thời gian
export const extractTimeAndLocation = async (prompt) => {
  const system_prompt = `Bạn là một trợ lý phân tích thông tin du lịch.
Từ câu hỏi của người dùng, hãy trả về kết quả dưới dạng JSON đúng chuẩn, không có chữ thừa:
{
  "location": "tên địa điểm hoặc 'Không xác định'",
  "date": "YYYY-MM-DD hoặc 'Không xác định'"
}`;
  const result = await callGemini(system_prompt, prompt);

  try {
    // ✅ Làm sạch kết quả (loại bỏ ```json và ```)
    const cleanResult = result.replace(/```json|```/gi, "").trim();
    console.log("📌 Raw Gemini result:", result);
    console.log("📌 Cleaned JSON string:", cleanResult);

    return JSON.parse(cleanResult);
  } catch (e) {
    console.error("❌ Lỗi parse JSON từ Gemini:", result);
    return { location: "Không xác định", date: "Không xác định" };
  }
};

// 🔹 2️⃣ Tư vấn chuyến đi
export const getTravelAdvice = async (prompt, weather = null) => {
  let weatherContext = "";
  if (weather) {
    weatherContext = `
Thông tin thời tiết đã phân tích trước:
- Địa điểm: ${weather.location}
- Nhiệt độ: ${weather.temp}°C
- Mô tả: ${weather.description}
- Độ ẩm: ${weather.humidity}%
- Gió: ${weather.wind} m/s
- Ngày: ${weather.date}
Hãy dựa vào dữ liệu thời tiết này để tư vấn chính xác hơn.
    `;
  }

  const system_prompt = `Bạn là một trợ lý du lịch thông minh. 
Hãy tư vấn dựa trên thời gian, địa điểm, và đặc biệt dựa vào thông tin thời tiết nếu có.
Trả lời theo cấu trúc:
🌤 Thời tiết: [ngắn gọn, dựa vào dữ liệu thực tế nếu có]
🎯 Gợi ý hoạt động: [hoạt động phù hợp, nếu trời mưa thì khuyên hạn chế camping ngoài trời]
🎒 Một số khu camping gần đó
🎒 Danh sách vật dụng: [những đồ cần mang theo phù hợp thời tiết]
⚠️ Lưu ý đặc biệt: [cảnh báo hoặc khuyến nghị quan trọng]

Mỗi mục ≤75 từ, rõ ràng và ngắn gọn.`;

  return await callGemini(system_prompt, weatherContext + "\n\nCâu hỏi: " + prompt);
};

// 🔹 3️⃣ Flow đầy đủ: phân tích + thời tiết + tư vấn
export const getTravelPlan = async (userPrompt) => {
  const extracted = await extractTimeAndLocation(userPrompt);
  console.log("📌 Kết quả phân tích Prompt 1:", extracted);

  let weather = null;
  if (extracted.location !== "Không xác định") {
    try {
      weather = await getWeather(extracted.location, extracted.date);
      console.log("📌 Dữ liệu thời tiết lấy từ OpenWeather:", weather);
    } catch (err) {
      console.error("❌ Không lấy được thời tiết:", err.message);
    }
  }

  const advice = await getTravelAdvice(userPrompt, weather);
  console.log("📌 Tư vấn cuối cùng (Prompt 2):", advice);

  return {
    advice,
  };
};
