'use client';

import BaseChat from "@/components/chat/BaseChat";
import { Preview } from "@/components/chat/Preview";
import { useState } from "react";
import { Button } from "./ui/button";
import { Code, Layout } from "lucide-react";

export const ContentArea = () => {
    const [activeTab, setActiveTab] = useState<"chat" | "preview">("chat");

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-border">
                <nav className="flex" aria-label="Tabs">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("chat")}
                        className={`${activeTab === "chat" && "border-b-2 border-primary"} px-4 py-2 text-sm font-medium`}
                    >
                        <Code className="mr-2 h-4 w-4" />
                        Chat
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("preview")}
                        className={`${activeTab === "preview" && "border-b-2 border-primary"} px-4 py-2 text-sm font-medium`}
                    >
                        <Layout className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                </nav>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto">
                <BaseChat className={`${activeTab === 'chat' ? '' : 'hidden'}`} />
                <Preview className={`${activeTab === 'preview' ? '' : 'hidden'}`} />
            </div>
        </div>
    )
};