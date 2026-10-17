import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

 const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

export const generateResponse = async (contents) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
    });

    return response.text;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateResponseStream = async (contents) => {
  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.8-flash",
      contents,
    });

    return responseStream;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



// const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// export const generateResponse = async (contents, stream = false) => {
//   try {
//     const messages = Array.isArray(contents)
//       ? contents.map((item) => ({
//           role: item.role,
//           content: item.parts
//             ? item.parts.map((part) => part.text || "").join("")
//             : item.content,
//         }))
//       : [{ role: "user", content: contents }];

//     const response = await fetch(OPENROUTER_API_URL, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-4o",
//         messages,
//         stream,
//       }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(
//         error.error?.message || "OpenRouter API request failed"
//       );
//     }

//     if (stream) {
//       return response.body;
//     }

//     const data = await response.json();
//     return data.choices?.[0]?.message?.content ?? "";
//   } catch (error) {
//     console.error("OpenRouter API Error:", error);
//     throw error;
//   }
// };