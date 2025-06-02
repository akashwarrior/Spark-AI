'use client';

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Sparkles } from "lucide-react";
import { promptAtom } from "@/lib/stores/promptAtom";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";

const ANIMATION_DURATION = 800;

export default function Chat() {
    const router = useRouter();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { messages, status, setInput, handleSubmit } = useChat({
        api: '/api/enhancer',
        onError: (error) => { console.log(error); },
    });

    useEffect(() => {
        if (messages[messages.length - 1]?.role === 'assistant') {
            const prompt = messages[messages.length - 1].content;
            if (!textAreaRef.current || !prompt) return;

            const textArea = textAreaRef.current;
            if (!prompt.includes(textArea.value)) {
                textArea.value = '';
            }
            const delay = Math.floor(ANIMATION_DURATION / (prompt.length - textArea.value.length));

            intervalRef.current = setInterval(() => {
                if (textArea.value.length < prompt.length) {
                    textArea.value += prompt[textArea.value.length];
                    textArea.scrollTop = textArea.scrollHeight;
                } else {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    textArea.value = textArea.value.trim();
                    textArea.focus();
                }
            }, delay);

        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (textAreaRef.current) {
                textAreaRef.current.scrollTo(0, textAreaRef.current.scrollHeight);
            }
        }
    }, [messages]);

    const submitPrompt = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        promptAtom.set(textAreaRef.current?.value || '');
        alert('submitted')
    }


    return (
        <div className="rounded-lg max-w-2xl w-full overflow-hidden z-50 p-0.5 group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[118%] group-focus-within:animate-border-rotate group-hover:animate-border-rotate aspect-square [background-image:linear-gradient(90deg,_#3b6bff,_#2e96ff_65%,_#acb7ff)]" />
            <div className="bg-background w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-primary/15 to-primary/5">
                <Textarea
                    ref={textAreaRef}
                    autoFocus
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            router.push('/chat/1')
                        }
                    }}
                    onSubmit={submitPrompt}
                    maxLength={20000}
                    placeholder="How can I help you today?"
                    className="w-full py-3 px-3 text-[15px]! focus-visible:ring-0 bg-transparent! outline-none shadow-none border-none min-h-16 max-h-96 resize-none overflow-y-auto! focus transition-all duration-300"
                />
                <div className="flex items-center justify-between m-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="hover:fill-current fill-none"
                        disabled={status === 'submitted' || status === 'streaming'}
                        onClick={() => {
                            if (textAreaRef.current) {
                                setInput(textAreaRef.current.value)
                            }
                            handleSubmit()
                        }}
                    >
                        <Sparkles
                            className={cn(
                                "text-primary",
                                (status === 'submitted' || status === 'streaming') ? "animate-spin fill-primary" : "fill-inherit"
                            )}
                        />
                    </Button>
                    <Button className="rounded-xl w-8 h-8 shadow-xs"
                        onClick={submitPrompt}>
                        <ArrowUp />
                    </Button>
                </div>
            </div >
        </div>
    );
}