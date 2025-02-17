"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SendHorizontalIcon,
  Loader,
  Loader2,
  BotIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { chatBotResponse } from "./actions";
import LoadingButton from "@/components/controls/LoadingButton";

interface Message {
  role: "bot" | "user";
  text: string;
}
const initialBotMessage: Message = {
  role: "bot",
  text: "Hello! How can I assist you regarding your finance today? Feel free to ask anything!",
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [typingText, setTypingText] = useState<string>("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [messages, typingText]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);
    setTypingText("");
    const botResponse = await chatBotResponse(input);
    setInput("");
    let i = 0;

    const typingInterval = setInterval(() => {
      if (i < botResponse.length) {
        setTypingText((prev) => prev + botResponse.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
        setTypingText("");
        setLoading(false);
      }
    }, 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <main className="mx-auto rounded-xl border bg-background">
      <header className="space-y-0.5 border border-b py-4 text-center">
        <h1 className="text-bold text-2xl"> chatbot</h1>
        <p className="text-muted-foreground">
          Ask me anything regarding finance
        </p>
      </header>
      <div
        ref={scrollRef}
        className="max-h-[400px] min-h-[400px] space-y-4 overflow-y-auto px-2 pb-8 pt-4"
      >
        {messages.length === 0 && (
          <div className="py-4 text-center text-muted-foreground">
            No messages yet. Start a conversation!
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "my-4 flex items-center gap-2",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.role === "bot" && (
              <BotIcon className="size-6 text-muted-foreground" />
            )}
            <div
              className={cn(
                message.role === "user"
                  ? "bg-accent/75 text-muted-foreground"
                  : "bg-accent text-foreground/80",
                "max-w-[75%] rounded-md px-3 py-2 font-serif text-[15px] font-medium leading-7",
              )}
            >
              {message.text}
            </div>
            {message.role === "user" && (
              <UserIcon className="size-6 text-muted-foreground" />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center justify-start space-x-2">
            <BotIcon className="size-6 text-muted-foreground" />

            <div className="max-w-[75%] rounded-md bg-accent px-3 py-2 font-serif text-[15px] font-medium leading-7 text-foreground/80">
              {typingText ? (
                typingText
              ) : (
                <Loader2 className="mr-3 inline size-4 animate-spin text-muted-foreground" />
              )}
              <span className="animate-pulse">|</span>
            </div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="flex items-center justify-center space-x-2 pt-24">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-16 w-16 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 1C8.134 1 5 4.134 5 8v4H4a1 1 0 00-1 1v6a1 1 0 001 1h2v2a1 1 0 001 1h10a1 1 0 001-1v-2h2a1 1 0 001-1v-6a1 1 0 00-1-1h-1V8c0-3.866-3.134-7-7-7zm-1 7h2v2h-2V8zm0 4h2v6h-2v-6z"
              />
            </svg>
            <span className="text-lg text-muted-foreground/50">
              I&apos;m ready to help! Type a message to start.
            </span>
          </div>
        )}
      </div>
      <form
        className="relative mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <Input
          className="h-12 pe-10"
          value={input}
          placeholder="Enter your text here..."
          onChange={handleInputChange}
          type="text"
        />
        <LoadingButton
          loading={loading}
          variant="ghost"
          className="absolute right-0 top-1/2 -translate-y-1/2 transform"
        >
          <SendHorizontalIcon className="size-5 text-foreground" />
        </LoadingButton>
      </form>
    </main>
  );
};

export default ChatBot;
