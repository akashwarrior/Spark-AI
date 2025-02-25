import { streamText } from "ai";
import { systemPrompt } from "@/lib/server/prompt";
import { model } from "@/lib/server/model";

export async function POST(req: Request) {
    const { message } = await req.json();
    try {
        const result = await streamText({
            model: model,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: stripIndents`
                I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.
      
                IMPORTANT: Only respond with the improved prompt and nothing else!
      
                <original_prompt>
                  ${message}
                </original_prompt>
              `,
            }],
        });
        return result.toDataStreamResponse();

    } catch (error) {
        console.log(error);
        return Response.json({ message: 'Internal Server Error' });
    }
}

function stripIndents(arg0: string | TemplateStringsArray, ...values: any[]) {
    if (typeof arg0 !== 'string') {
        const processedString = arg0.reduce((acc, curr, i) => {
            acc += curr + (values[i] ?? '');
            return acc;
        }, '');

        return _stripIndents(processedString);
    }

    return _stripIndents(arg0);
}

function _stripIndents(value: string) {
    return value
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trimStart()
        .replace(/[\r\n]$/, '');
}
