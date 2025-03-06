import { createGoogleGenerativeAI } from "@ai-sdk/google"

function getGeminiModel() {
    const gemini = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
    });

    return gemini('gemini-2.0-flash-001', {
        useSearchGrounding: true,
        structuredOutputs: true,
    });
}

export const model = getGeminiModel();