'use client';

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { getNextId, openDatabase, setMessages } from "@/lib/persistence";

const db = await openDatabase();

export default function Home() {
    const router = useRouter();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const { messages, status, append } = useChat({
        api: '/api/enhancer',
        onFinish: () => textAreaRef.current?.focus(),
        onError: (error) => toast.error(error.message),
    });

    useEffect(() => {
        if (textAreaRef.current && messages[messages.length - 1]?.role === 'assistant') {
            textAreaRef.current.value = messages[messages.length - 1]?.content || '';
            handleTextAreaChange(textAreaRef.current);
        }
    }, [messages]);

    const handleTextAreaChange = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = 'auto';
        const newHeight = Math.min(Math.max(textarea.scrollHeight, 80), 288);
        textarea.style.height = `${newHeight}px`;
        textarea.scrollTop = textarea.scrollHeight;

        const newIsEmpty = textarea.value.trim() === '';
        setIsEmpty(newIsEmpty);
    };

    const submitPrompt = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const value = textAreaRef.current?.value.trim() || '';
        if (!value || !db) return;
        const id = await getNextId(db);
        setMessages(db, id, [{
            id: new Date().getTime().toString(),
            role: 'user',
            content: value,
        }], value)
        router.push(`/chat/${id}`);
    }

    const isLoading = status === 'submitted' || status === 'streaming';


    return (
        <main className="h-full flex flex-col relative w-full items-center justify-center px-5 gap-8 max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-primary-foreground to-primary bg-clip-text text-transparent">
                Spark AI
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into reality with AI-powered development.
                Build stunning applications, generate code, and bring your vision to life.
            </p>

            <div className="w-full max-w-2xl glass-panel rounded-lg overflow-hidden border border-border/50 focus-within:border-primary/50 transition-all duration-200">
                <textarea
                    name="prompt"
                    autoFocus
                    ref={textAreaRef}
                    onChange={(e) => handleTextAreaChange(e.target)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submitPrompt(e as any);
                        }

                        if (e.key.toLowerCase() === 'e' && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            append({
                                role: 'user',
                                content: textAreaRef.current?.value || ''
                            })
                        }
                    }}
                    placeholder="Describe your project in detail... What do you want to build?"
                    className="w-full py-4 px-4 text-[15px] leading-relaxed ring-0 bg-transparent outline-none shadow-none border-none min-h-20 resize-none overflow-y-auto text-foreground placeholder:text-muted-foreground"
                />

                <div className="flex items-center justify-between px-3 pb-3">
                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7"
                            disabled={isEmpty || isLoading}
                            onClick={() => {
                                console.log(textAreaRef.current?.value);
                                append({
                                    role: 'user',
                                    content: textAreaRef.current?.value || ''
                                })
                            }}
                        >
                            <Sparkles className={cn(
                                "h-3 w-3 mr-1.5",
                                isLoading && "animate-spin text-primary"
                            )} />
                            Enhance
                        </Button>

                        {/* Keyboard hints */}
                        <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                            <kbd className="px-1.5 py-0.5 bg-muted/30 rounded">⌘ + E</kbd>
                            Enhance
                        </span>
                    </div>

                    <Button
                        className={cn(
                            "h-9 px-4 transition-all duration-200",
                            !isEmpty && !isLoading && "shadow-lg shadow-primary/20 hover:scale-105"
                        )}
                        onClick={submitPrompt}
                        disabled={isEmpty || isLoading}
                    >
                        {isLoading ? (
                            <div className="loading-dots">
                                <div />
                                <div />
                                <div />
                            </div>
                        ) : (
                            <>
                                <Zap className="h-4 w-4 mr-2" />
                                Create
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </main>
    )
}