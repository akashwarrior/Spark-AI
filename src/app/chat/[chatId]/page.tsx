import { redirect } from "next/navigation";
import ChatPageClient from "@/components/ChatPageClient";

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;

  if (Number.isNaN(Number(chatId))) {
    redirect('/');
  }

  return <ChatPageClient chatId={chatId} />;
}