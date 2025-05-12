import { convertToCoreMessages, streamText } from "ai";
import { systemPrompt } from "@/lib/server/prompt";
import { model } from "@/lib/server/model";

export async function POST(req: Request) {
    const { messages } = await req.json();
    try {
        const result = streamText({
            model,
            system: systemPrompt,
            messages: convertToCoreMessages(messages),
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.log(error);
        return Response.json({ message: 'Internal Server Error' });
    }
}