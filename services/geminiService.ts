import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY || '';

if (!apiKey) {
  console.error("API_KEY is not set in the environment.");
}

const ai = new GoogleGenAI({ apiKey });

let chatSession: Chat | null = null;

export const startChat = (): Chat => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 2000, 
    },
  });
  return chatSession;
};

export const sendMessage = async (message: string): Promise<string> => {
  if (!chatSession) {
    startChat();
  }
  
  try {
    if (!chatSession) throw new Error("Chat session failed to initialize");
    
    const result = await chatSession.sendMessage({ message });
    return result.text || "माफ गर्नुहोला, मसँग अहिले जवाफ छैन। कृपया पुनः प्रयास गर्नुहोस्।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("API request failed");
  }
};
