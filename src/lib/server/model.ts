import { createGoogleGenerativeAI } from "@ai-sdk/google"

function getGeminiModel() {
    const gemini = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
    });

    return gemini('gemini-2.0-flash-thinking-exp-01-21', {
        useSearchGrounding: true,
    });
}

export const model = getGeminiModel();