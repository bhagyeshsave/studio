import { ChatbotClient } from "@/components/features/chatbot-client";
import { Card } from "@/components/ui/card";

export default function ChatbotPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-2xl">
        <ChatbotClient />
      </Card>
    </div>
  );
}
