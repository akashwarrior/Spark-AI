import { FileTree } from "@/components/chat/FileTree";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCode } from "lucide-react";
import ThemeToggle from "@/components/theme/theme-toggle";
import { ContentArea } from "@/components/Content";
import { redirect } from "next/navigation";
import CodeEditor from "@/components/chat/CodeEditor";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = (await params);

  if (chatId.length !== 1 || Number.isNaN(Number(chatId[0]))) {
    console.error("No chatId provided", chatId);
    redirect('/');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r border-border backdrop-blur-xs">
        <div className="p-4 border-b border-border">
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          <FileTree />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border backdrop-blur-xs p-4 flex items-center justify-center mx-4">
          <div className="flex flex-col flex-1">
            <h1 className="text-lg font-semibold">{"Title"}</h1>
            <p className="text-sm text-muted-foreground">Chat #{chatId}</p>
          </div>
          <ThemeToggle />
        </header>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat and Preview area */}
          <ContentArea />

          {/* Code editor */}
          <div className="w-1/2 border-l border-border flex flex-col">
            <div className="p-4 border-b border-border backdrop-blur-xs">
              <h2 className="text-sm font-semibold flex items-center">
                <FileCode className="mr-2 h-4 w-4" />
                Code Editor
              </h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <CodeEditor />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}