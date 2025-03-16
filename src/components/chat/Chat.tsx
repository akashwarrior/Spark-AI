'use client';

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Sparkles } from "lucide-react";
import { promptAtom } from "@/lib/stores/promptAtom";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useStore } from "@nanostores/react";

const ANIMATION_DURATION = 1000;

export default function Chat() {
    const router = useRouter();
    const prompt = useStore(promptAtom);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const { messages, status, append, setMessages } = useChat({
        api: '/api/enhancer',
        onError: (error) => { console.log(error); },
    });

    useEffect(() => {
        if (messages[messages.length - 1]?.role === 'assistant') {
            promptAtom.set(messages[messages.length - 1].content);
            setMessages([]);
        }
    }, [messages]);


    useEffect(() => {
        if (!textAreaRef.current) return;

        const textArea = textAreaRef.current;
        if (!prompt.includes(textArea.value)) {
            textArea.value = '';
        }
        const delay = Math.floor(ANIMATION_DURATION / (prompt.length - textArea.value.length));


        const interval = setInterval(() => {
            if (textArea.value.length < prompt.length) {
                textArea.value += prompt[textArea.value.length];
                textArea.dispatchEvent(new Event('input', { bubbles: true }));
                textArea.scrollTop = textArea.scrollHeight;
            } else {
                clearInterval(interval);
                textArea.focus();
            }
        }, delay);

        return () => {
            clearInterval(interval);
            textArea.value = prompt;
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            textArea.scrollTop = textArea.scrollHeight;
        }
    }, [prompt]);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, []);


    return (
        <div className="relative max-w-2xl mx-auto bg-secondary/50 rounded-lg border border-secondary-foreground/20 transition-colors duration-200">
            <Textarea
                ref={textAreaRef}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        router.push('/chat/1')
                    }
                }}
                placeholder="Describe your project..."
                className="w-full py-3 px-3 text-lg focus-visible:ring-0 bg-transparent outline-none shadow-none border-none min-h-[2.5rem] max-h-96 resize-none !overflow-y-auto"
            />
            <div className="flex items-center justify-between m-2">
                <Button
                    onClick={() => {
                        setMessages([]);
                        const input = textAreaRef.current?.value ?? '';
                        if (!input) return;
                        append({ content: input, role: 'user' });
                    }}
                    disabled={status === 'submitted' || status === 'streaming'}
                    variant="ghost"
                    size="sm"
                    className={`text-xs text-muted-foreground hover:fill-current ${(status === 'submitted' || status === 'streaming') ? "fill-current" : "fill-none"}`}>
                    <Sparkles className={`w-3 h-3 fill-inherit ${(status === 'submitted' || status === 'streaming') && "animate-spin"}`} />
                </Button>
                <Button className="rounded-xl w-8 h-8 bg-muted-foreground hover:bg-foreground shadow-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push('/chat/1')
                    }}>
                    <ArrowUp />
                </Button>
            </div>
        </div >
    );
}