// server.js
import { GoogleGenAI } from "@google/genai";
import express from "express";
import cors from "cors"; // لإدارة الوصول من الواجهة الأمامية

// 1. تعريف مفتاح API
const API_KEY = "AIzaSyDbO_p3OFG4z-NCkuFFMf-5HRo3mnrYLNE";
const ai = new GoogleGenAI({ apiKey: API_KEY });

// 2. تعليمات النظام (GIS_SYSTEM_INSTRUCTION)
const GIS_SYSTEM_INSTRUCTION = `
  You are an expert, helpful chatbot specializing exclusively in the field of Geographic Information Systems (GIS), Geomatics, Cartography, Geospatial Data Analysis, and Remote Sensing.
  
  **STRICTLY adhere to the following formatting rules:**
  
  1. **NO MARKDOWN FORMATTING:** Do NOT use any Markdown symbols whatsoever. This includes asterisks (*), hash symbols (#), hyphens (-), or any other special characters used for bolding, headings, or bullet points. The only exception is sequential numbering.
  
  2. **USE NUMBERED LISTS ONLY FOR ORGANIZATION:** If you must organize information into a list, use only sequential numbering (1. 2. 3. etc.).
  
  3. **STRUCTURED NUMBERING:** Ensure the number is placed at the very beginning of a new line, followed by a single space, then the list item text. Do NOT embed the number within a flowing paragraph.
  
  4. **FLOWING PLAIN TEXT ONLY:** The response must be written as clear, simple, flowing plain text without any visual embellishments, symbols, **or explicit subheadings/sections outside of the numbered lists.**
  
  5. **LANGUAGE RULE:** The response MUST be written in the exact language of the user's query.

  ... (بقية التعليمات التي قمنا بتعريفها سابقاً) ...
`;

// 3. دوال إدارة المحادثة
let gisChatSession = null;

async function initializeGisChatbot() {
  const model = "gemini-2.5-flash";

  try {
    gisChatSession = ai.chats.create({
      model: model,
      config: {
        systemInstruction: GIS_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });
    console.log("✅ GIS Chatbot session initialized.");
    return true;
  } catch (error) {
    console.error("❌ Initialization Error:", error);
    return false;
  }
}

// ✅ تعديل دالة الرد لتتضمن إعادة المحاولة التلقائية عند خطأ 503
async function getGisChatResponse(userMessage, retries = 3) {
  if (!gisChatSession) {
    await initializeGisChatbot();
  }

  try {
    const result = await gisChatSession.sendMessage({ message: userMessage });
    return result.text;
  } catch (error) {
    console.error("⚠️ Gemini API Error:", error);

    // إذا السيرفر مشغول (503) نحاول تاني
    if (retries > 0 && error.message.includes("503")) {
      console.log(`🔁 Gemini server busy, retrying... (${4 - retries}/3)`);
      await new Promise((res) => setTimeout(res, 3000)); // انتظر ثانيتين
      return getGisChatResponse(userMessage, retries - 1);
    }

    return "⚠️ The GIS Chatbot is currently overloaded. Please try again later.";
  }
}

// 4. إعداد خادم Express
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// تهيئة الروبوت عند بدء الخادم
initializeGisChatbot();

// نقطة النهاية (Endpoint)
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  const botResponse = await getGisChatResponse(userMessage);
  res.json({ response: botResponse });
});

// خدمة ملفات HTML/JS/CSS الثابتة
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log("🌍 Access the chat interface via your browser.");
});
