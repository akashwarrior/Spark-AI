"use client"

import { useRef, useEffect } from "react"
import { Bot, Send, StopCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "@ai-sdk/react"
import { parseXml } from "@/lib/utils/constants"
import { useChatHistory } from "@/lib/persistence/useChatHistory"
import { toast } from "sonner"
import { useStore } from "@nanostores/react"
import { messageAtom } from "@/lib/stores/messageAtom"

export default function BaseChat({ chatId }: { chatId: string }) {
  const msgs = useStore(messageAtom);
  const { initialMessages, storeMessageHistory } = useChatHistory(chatId);
  const { messages, status, stop, handleInputChange, handleSubmit, input } = useChat({
    api: '/api/chat',
    initialMessages,
    onError: (error) => toast.error(error.message),
    onFinish: () => storeMessageHistory(messages),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    const msg = messages[messages.length - 1];
    if (msg?.role === 'user') {
      parseXml(msg.content, msg.id, msg.role);
    }
    messagesEndRef.current?.scrollTo({ top: messagesEndRef.current?.scrollHeight, behavior: 'smooth' });
  }, [messages])


  const submitInput = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    messagesEndRef.current?.scrollTo({ top: messagesEndRef.current?.scrollHeight, behavior: 'smooth' });
  }

  return (
    <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto overflow-hidden">
      <div
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto pb-10"
      >
        {msgs.length > 0 && (
          <div className="p-4 space-y-4">
            {msgs.map((message) => (
              <div key={message.id} className="flex items-start gap-3 group transition-all duration-200">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <time className="text-xs text-muted-foreground">
                      {message.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {message.steps[message.steps.length - 1]?.content}
                  </div>
                </div>
              </div>
            ))}

            {status === 'submitted' && (
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl backdrop-blur-sm border border-border transition-all duration-200">
                <Bot className="w-6 h-6 text-primary" />
                <div className="flex items-center gap-2">
                  <div className="loading-dots">
                    <div />
                    <div />
                    <div />
                  </div>
                  <span className="text-xs text-muted-foreground">Processing your request...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={submitInput} className="border-t border-border glass-panel-strong p-4">
        <div className="relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Ask me anything or describe what you want to build..."
            className="min-h-[50px] max-h-32 bg-input/50 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground 
                     focus:bg-input/70 focus:border-primary/50 focus:ring-0 resize-none pr-12 text-[15px] leading-relaxed transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitInput(e as any);
              }
            }}
          />

          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 absolute right-2 bottom-2"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <StopCircle className="h-4 w-4" onClick={(e) => { e.preventDefault(); stop(); }} />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
};