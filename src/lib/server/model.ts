import { createGoogleGenerativeAI } from "@ai-sdk/google"

function getGeminiModel() {
    const gemini = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
    });

    return gemini('gemini-2.0-pro-exp-02-05', {
        useSearchGrounding: true,
    });
}

export const model = getGeminiModel();