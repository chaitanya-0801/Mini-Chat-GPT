import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

export const generateResponse = async (contents) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
    });

    return response.text;
  } catch (error) {
    console.error(error);
    throw error;
  }
};