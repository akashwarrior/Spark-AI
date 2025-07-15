'use client';

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FileTree } from "@/components/FileTree";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import BaseChat from "@/components/BaseChat";
import { Preview } from "@/components/Preview";
import { Files, Code, Eye, Maximize2, Minimize2 } from "lucide-react";

export default function ChatPageClient({ chatId }: { chatId: string }) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'files'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="relative z-10 flex h-full">
        <div className={cn(
          "border-r border-border glass-panel flex flex-col transition-all duration-300 ease-linear",
          isFullscreen ? "w-full" : "w-[40%]"
        )}>
          <div className="h-14 border-b border-border glass-panel-strong flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-sm h-8 px-3">
                  ← Back
                </Button>
              </Link>
              <div className="hidden sm:block">
                <span className="text-sm text-muted-foreground">Chat #{chatId}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen chat"}
            >
              {isFullscreen ? <Minimize2 /> : <Maximize2 />}
            </Button>
          </div>

          <BaseChat chatId={chatId} />
        </div>

        {!isFullscreen && (
          <div className="flex-1 flex flex-col glass-panel">
            <div className="h-14 border-b border-border glass-panel-strong flex items-center justify-between px-4">
              <div className="flex gap-1">
                {[
                  {
                    label: 'preview',
                    Icon: Eye,
                  },
                  {
                    label: 'code',
                    Icon: Code,
                  },
                  {
                    label: 'files',
                    Icon: Files,
                  },
                ].map(({ Icon, label }) =>
                  <Button
                    size="sm"
                    key={label}
                    variant={activeTab === label ? "secondary" : "ghost"}
                    onClick={() => setActiveTab(label as 'preview' | 'code' | 'files')}
                    className={cn(
                      "text-sm font-medium transition-all duration-200 hover:bg-primary/20! gap-2",
                      activeTab === label && "bg-primary/20 text-primary-foreground shadow-lg shadow-primary/10 hover:bg-primary/30!"
                    )}
                  >
                    <Icon />
                    {label}
                  </Button>
                )}
              </div>


              <div className="text-sm text-muted-foreground">
                {activeTab === 'preview' ? 'Live Preview' :
                  activeTab === 'code' ? 'Source Code' : 'Project Files'}
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="h-full p-4">
                <div className="h-full glass-panel rounded-xl overflow-hidden">
                  {activeTab === 'preview' && <Preview />}
                  {activeTab === 'code' && <CodeEditor />}
                  {activeTab === 'files' && <FileTree />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 