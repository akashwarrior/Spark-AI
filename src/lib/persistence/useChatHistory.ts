import { useState, useEffect } from 'react';
import type { Message } from 'ai';
import { toast } from 'react-toastify';
import { getMessages, openDatabase, setMessages } from './db';
import { useParams, useRouter } from 'next/navigation';

export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}

export const db = await openDatabase();

export function useChatHistory() {
  const router = useRouter();
  const { chatId } = useParams<{ chatId?: string }>();

  if (!chatId) {
    router.push('/');
    return;
  }

  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!db) {
      return;
    }

    getMessages(db, chatId)
      .then((storedMessages) => {
        if (storedMessages && storedMessages.messages.length > 0) {
          setInitialMessages(storedMessages.messages);
          setReady(true);
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
    ready,
    initialMessages,
    storeMessageHistory: async (messages: Message[]) => {
      if (!db || messages.length === 0) {
        return;
      }
      await setMessages(db, chatId, messages);
    },
  };
}