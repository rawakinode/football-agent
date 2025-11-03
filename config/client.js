import 'dotenv/config';
import OpenAI from 'openai';

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;
const model = "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new";

// Inisialisasi OpenAI client
export const fireworksClient = new OpenAI({
    apiKey: FIREWORKS_API_KEY,
    baseURL: "https://api.fireworks.ai/inference/v1",
});

// Wrapper for chat completions
export async function createChatCompletion(messages) {
    return fireworksClient.chat.completions.create({
        model,
        messages,
    });
}