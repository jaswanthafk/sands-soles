import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStylistRecommendations = async (
  userQuery: string,
  inventory: Product[]
): Promise<{ recommendedIds: string[]; message: string }> => {
  try {
    // Create a simplified inventory string to save tokens
    const inventoryContext = inventory
      .map((p) => `ID: ${p.id}, Name: ${p.name}, Brand: ${p.brand}, Tags: ${p.tags.join(", ")}, Price: ${p.price} KWD, Desc: ${p.description}`)
      .join("\n");

    const systemInstruction = `
      You are 'Soul', a high-end sneaker stylist for the store 'Sands & Souls' in Kuwait.
      Your goal is to recommend sneakers from the provided inventory based on the user's request.
      Kuwait's context: Hot weather, mall culture, mix of traditional (thobe/dishdasha) and western streetwear.
      
      If the user asks for something not in inventory, politely suggest the closest match or explain why.
      Be trendy, concise, and helpful.

      Return the response in JSON format with two fields:
      1. 'recommendedIds': Array of strings (Product IDs).
      2. 'message': A short, friendly explanation of why you picked these (max 2 sentences).
    `;

    const prompt = `
      Current Inventory:
      ${inventoryContext}

      User Request: "${userQuery}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            message: { type: Type.STRING },
          },
          required: ["recommendedIds", "message"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      recommendedIds: [],
      message: "I'm having a bit of trouble connecting to the style server right now. Please try again!",
    };
  }
};
