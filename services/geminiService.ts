
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackEntry, ActionPlan } from "../types";

export async function summarizeFeedback(entries: FeedbackEntry[]): Promise<ActionPlan> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const commentsText = entries.map(e => `[Mood: ${e.mood}/5] ${e.comment}`).join('\n---\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      Act as an expert HR consultant. Analyze the following anonymous employee feedback and mood data.
      1. Identify common themes/keywords (maximum 4).
      2. Provide a concrete 3-point action plan for management to improve company culture based ONLY on these comments.
      
      Feedback Data:
      ${commentsText}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          themes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Top 3-4 recurring themes found in feedback."
          },
          points: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The 3 most important actions management should take."
          }
        },
        required: ["themes", "points"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return {
      themes: data.themes || ["Culture", "General"],
      points: data.points?.slice(0, 3) || ["Continue listening to feedback", "Acknowledge team efforts", "Schedule a follow-up session"]
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid AI response format");
  }
}
