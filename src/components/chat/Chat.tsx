'use client';

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Sparkles } from "lucide-react";
import { useStore } from "@nanostores/react";
import { promptAtom } from "@/lib/stores/promptAtom";
import { useRouter } from "next/navigation";

export default function Chat() {
    const prompt = useStore(promptAtom);
    const router = useRouter();

    const handleSubmit = (e: (React.MouseEvent | React.KeyboardEvent)) => {
        e.preventDefault();
        router.push('/chat/1');
    }

    return (
        <div className="relative max-w-2xl mx-auto bg-secondary/50 rounded-lg border border-secondary-foreground/20 transition-colors duration-200">
            <Textarea
                value={prompt}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        handleSubmit(e);
                    }
                }}
                onChange={(e) => promptAtom.set(e.target.value)}
                placeholder="Describe your project..."
                className="w-full py-3 px-3 text-lg resize-none focus-visible:ring-0 bg-transparent outline-none shadow-none border-none"
            />
            <div className="flex items-center justify-between m-2">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:fill-current fill-none">
                    <Sparkles className="w-3 h-3 fill-inherit" />
                </Button>
                <Button className="rounded-xl w-8 h-8 bg-muted-foreground hover:bg-foreground shadow-sm"
                    onClick={handleSubmit}>
                    <ArrowUp />
                </Button>
            </div>
        </div >
    );
}