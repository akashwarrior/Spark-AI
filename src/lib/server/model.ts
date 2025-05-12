import { createGoogleGenerativeAI } from "@ai-sdk/google"

function getGeminiModel() {
    const gemini = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
    });

    return gemini('gemini-2.5-pro-exp-03-25', {
        useSearchGrounding: true,
    });
}

export const model = getGeminiModel();