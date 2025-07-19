
"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { civicChatbot } from "@/ai/flows/civic-chatbot";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "@/hooks/use-toast";


interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp?: any;
}

export function ChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    // For simplicity, we'll use one chat session. In a real app, you'd manage multiple chat sessions.
    const hardcodedChatId = "global_chat";
    setChatId(hardcodedChatId);

    const messagesCol = collection(db, "chats", hardcodedChatId, "messages");
    const q = query(messagesCol, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        if (fetchedMessages.length === 0) {
             setMessages([
                {
                    id: "1",
                    text: "Hello! I'm your civic assistant. Ask me about safety ratings or local trends in your area.",
                    sender: "bot",
                },
            ]);
        } else {
            setMessages(fetchedMessages);
        }
    }, (error) => {
        console.error("Error fetching chat history:", error);
        toast({variant: 'destructive', title: 'Error', description: 'Could not load chat history.'});
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatId) return;

    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      text: input,
      sender: "user",
    };
    
    setInput("");
    setIsLoading(true);

    try {
      const messagesCol = collection(db, "chats", chatId, "messages");
      // Add user message to Firestore
      await addDoc(messagesCol, {
          ...userMessage,
          timestamp: serverTimestamp(),
      });

      const result = await civicChatbot({ query: input });
      const botMessage: Omit<Message, 'id' | 'timestamp'> = {
        text: result.answer,
        sender: "bot",
      };

      // Add bot message to Firestore
      await addDoc(messagesCol, {
          ...botMessage,
          timestamp: serverTimestamp(),
      });

    } catch (error) {
      console.error("Error sending message:", error);
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
