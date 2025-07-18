"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { civicChatbot } from "@/ai/flows/civic-chatbot";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export function ChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your civic assistant. Ask me about safety ratings or local trends in your area.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await civicChatbot({ query: input });
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.answer,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request right now. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-4",
                message.sender === "user" && "justify-end"
              )}
            >
              {message.sender === "bot" && (
                <Avatar className="h-9 w-9 border-2 border-primary">
                  <AvatarFallback>
                    <Bot className="text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-md rounded-lg px-4 py-3 text-sm shadow-md",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                )}
              >
                <p>{message.text}</p>
              </div>
              {message.sender === "user" && (
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarFallback>
                  <Bot className="text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-md rounded-lg bg-card px-4 py-3 text-sm shadow-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about local safety..."
            className="flex-1"
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
