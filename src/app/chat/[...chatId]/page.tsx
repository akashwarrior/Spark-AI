'use client';

import BaseChat from "@/components/chat/BaseChat";
import { FileTree } from "@/components/chat/FileTree";
import CodeEditor from "@/components/chat/CodeEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, FileCode, Layout } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseXml } from "@/lib/utils/constants";
import { useStore } from "@nanostores/react";
import { messageStore } from "@/lib/stores/messageStore";
import Link from "next/link";
import { Preview } from "@/components/chat/Preview";


export default function Page() {
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("chat");
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();
  const [message, setMessage] = useState<{
    title: string;
    pending?: boolean;
    code?: string;
    path?: string;
  }[]>([]);

  if (!chatId) {
    router.replace("/");
    return null;
  }

  const messages = useStore(messageStore);

  useEffect(() => {
    const content = messages[messages.length - 1]?.content;
    const msg = parseXml(content);
    setMessage(msg);
  }, [messages])

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r border-border bg-background/50 backdrop-blur-sm">
        <div className="p-4 border-b border-border">
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          <FileTree files={message.reduce((acc: Array<string>, msg) => {
            if (msg?.path) acc.push(msg.path);
            return acc;
          }, [])} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-background/50 backdrop-blur-sm p-4">
          <h1 className="text-lg font-semibold">{message[0]?.title}</h1>
          <p className="text-sm text-muted-foreground">Chat #{chatId}</p>
        </header>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat and Preview area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-border">
              <nav className="flex" aria-label="Tabs">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("chat")}
                  className={`${activeTab === "chat" ? "border-b-2 border-primary" : ""} px-4 py-2 text-sm font-medium`}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Chat
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("preview")}
                  className={`${activeTab === "preview" ? "border-b-2 border-primary" : ""} px-4 py-2 text-sm font-medium`}
                >
                  <Layout className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </nav>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "chat" && <BaseChat steps={message} />}
              {activeTab === "preview" && <Preview message={message} />}
            </div>
          </div>

          {/* Code editor */}
          <div className="w-1/2 border-l border-border flex flex-col">
            <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
              <h2 className="text-sm font-semibold flex items-center">
                <FileCode className="mr-2 h-4 w-4" />
                Code Editor
              </h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <CodeEditor message={message} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}