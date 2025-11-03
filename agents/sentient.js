import { PROMPT_ANALYZE_INPUT, PROMPT_PREDICTION } from '../prompt/prompt.js';
import { createChatCompletion } from "../config/client.js";

// Fungsi analisis dengan AI untuk ekstraksi tim
export const analyzeInputWithAI = async (userInput) => {
  try {

    const prompt = PROMPT_ANALYZE_INPUT.replace("{user_input}", userInput);
    const response = await createChatCompletion([{ role: "user", content: prompt }]);
    const content = response.choices[0].message.content.trim();

    // Ekstrak JSON dari response
    const jsonMatch = content.match(/\{.*\}/);
    if (jsonMatch) { return JSON.parse(jsonMatch[0]) }

    return null;

  } catch (error) {
    console.error('Error analyzing input with AI', error);
    return null;
  }
}

// Fungsi untuk menganalisa dan memprediksi hasil pertandingan berdasarkan data
export const predictionMatch = async (promptData) => {
  try {

    const prompt = PROMPT_PREDICTION.replace("{prompt_data}", promptData);
    const response = await createChatCompletion([{ role: "user", content: prompt }]);
    const content = response.choices[0].message.content.trim();

    if (content) { return content }
    return null;
  } catch (error) {
    return null;
  }
}