"use client"

import { useRef, useEffect, useCallback } from "react"
import { Bot, FileCode, Send, Sparkles, StopCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { promptStore } from "@/lib/stores/promptStore"
import { useChat } from "@ai-sdk/react"
import { AnimatePresence, motion } from "motion/react"
import { messageStore } from "@/lib/stores/messageStore"

export default function BaseChat({ steps }: { steps: { title: string, pending?: boolean }[] }) {

  const { messages, status, append, stop, handleInputChange, handleSubmit, input, setMessages } = useChat({
    onError: (error) => console.log(error),
    onFinish: () => { console.log("Chat finished") },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, []);

  useEffect(() => {
    if (promptStore.get().trim().length > 0) {
      append({ role: 'user', content: promptStore.get() });
      promptStore.set('');
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages(messageStore.get())
      return;
    }
    scrollToBottom();
    messageStore.set(messages);
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "flex gap-3 p-4 rounded-lg",
              message.role === "assistant"
                ? "bg-secondary/30 backdrop-blur-sm border border-border/50"
                : "bg-primary/5 backdrop-blur-sm",
            )}
          >
            <div className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center bg-background/50 backdrop-blur-sm shrink-0">
              {message.role === "assistant" ? <Bot className={`w-4 h-4 ${status === 'streaming' && "animate-pulse"}`} /> : <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <div className="leading-relaxed whitespace-pre-wrap [word-break:break-word]">
                  {(index === messages.length - 1) && message.content.includes("<boltArtifact") ?
                    <AnimatePresence>
                      {steps.map((step, id) => (
                        id > 0 &&
                        <motion.div
                          key={(step.title + id)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50 mb-4"
                        >
                          <FileCode className="w-4 h-4" />
                          <span className="text-sm">{step.title}</span>
                          <span className="text-xs text-muted-foreground">{(step.pending ? "Generating..." : "Done")}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    : message.content
                  }</div>
              </div>
              {status === "streaming" && message.role === "assistant" &&
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex pb-4 pt-2 rounded-lg w-full"
                >
                  <div className="flex-1">
                    <div className="h-4 w-12 bg-primary/20 rounded animate-pulse" />
                  </div>
                </motion.div>
              }
              <div className="flex items-center gap-2">
                <time className="text-xs text-muted-foreground">{message.createdAt?.toLocaleTimeString()}</time>
              </div>
            </div>
          </motion.div>
        ))}
        {status === "submitted" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-3 p-4 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50"
          >
            <div className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center bg-background/50 backdrop-blur-sm shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="h-4 w-12 bg-muted/30 rounded animate-pulse" />
            </div>
          </motion.div>
        )}
        {/* <AnimatePresence>
          {streamingFiles.map((fileName) => (
            <motion.div
              key={fileName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50"
            >
              <FileCode className="w-4 h-4" />
              <span className="text-sm">{fileName}</span>
              <span className="text-xs text-muted-foreground">Generating...</span>
            </motion.div>
          ))}
        </AnimatePresence> */}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Describe the component or functionality you want to add..."
            className="min-h-[2.5rem] max-h-32 bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 transition-colors focus:bg-secondary/80 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" size="icon" className={`${status !== "ready" && "hidden"}`}>
            <Send className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            onClick={stop}
            className={`${status === "ready" && "hidden"}`}
          >
            <StopCircle className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}