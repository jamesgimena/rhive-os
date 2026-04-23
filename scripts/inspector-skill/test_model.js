import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  const models = await ai.getModels();
  models.forEach(m => console.log(m.name));
}
// wait, the google/generative-ai package might not have getModels natively exposed properly if it's new. I'll just change the model string to gemini-1.5-pro for safety.
// I'll test it over curl if needed. 
