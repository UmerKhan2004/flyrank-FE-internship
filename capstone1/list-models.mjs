import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const pager = await client.models.list();

for await (const m of pager) {
  console.log(m.name, m.supportedActions);
}