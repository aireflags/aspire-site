import { GoogleGenAI } from "@google/genai"

const API_KEY = process.env.GEMINI_API_KEY

export const generateCopilotResponse = async (userPrompt: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key is not configured. Please check your environment."
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY })
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: "You are a professional financial Copilot for a Senior Broker named Alex. Provide concise, expert insights on market trends, compliance, and portfolio management. Always remain professional and helpful.",
        temperature: 0.7,
      },
    })

    return response.text || "I'm sorry, I couldn't process that request."
  } catch (error) {
    console.error("Gemini API Error:", error)
    return "Error: Unable to connect to the intelligence service. Please try again later."
  }
}
