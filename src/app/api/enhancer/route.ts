import { streamText } from "ai";
import { model } from "@/lib/server/model";

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        const result = streamText({
            model,
            prompt: `I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.
      
                IMPORTANT: Only respond with the improved prompt and nothing else!
      
                <original_prompt>
                  ${messages[messages.length - 1].content}
                </original_prompt>
              `,
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.log(error);
        return Response.json({ message: 'Internal Server Error' });
    }
}