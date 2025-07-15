'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Message } from 'ai';
import { getMessages, openDatabase, setMessages } from '@/lib/persistence/db';
import { parseXml } from '@/lib/utils/constants';

export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}

export const db = await openDatabase();

export function useChatHistory(chatId: string) {
  const router = useRouter();
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!db) return;

    getMessages(db, chatId)
      .then((storedMessages) => {
        if (storedMessages && storedMessages.messages.length > 0) {
          const messages = storedMessages.messages;
          setInitialMessages(messages);
          messages.forEach((msg) => parseXml(msg.content, msg.id, msg.role));
        } else {
          router.push(`/`);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        router.push(`/`);
      });
  }, [db]);

  return {
    initialMessages,
    storeMessageHistory: async (messages: Message[]) => {
      if (!db) return;
      await setMessages(db, chatId, messages);
    },
  };
}