"use client";

import { useMutation } from "@tanstack/react-query";
import { BotMessageSquare } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function EndUserPage() {
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (text: string) => {
      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };
      setMessages((old) => [...old, optimisticMessage]);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((old) => [...old, assistantMessage]);
    },
    onError: () => {
      alert("Something went wrong. Please try again.");
    },
  });

  const handleSend = () => {
    if (!input.trim() || isPending) return;
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  return (
    <main className="max-w-5xl w-full mx-auto flex-1 p-4 flex flex-col items-center h-full min-h-0">
      <div className="w-full max-w-4xl flex flex-col gap-8 flex-1 min-h-0 h-full">
        <div className="w-full flex flex-col items-center gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            Welcome to N3XA Support
          </h1>
          <p className="text-muted-foreground text-gray-300 text-center">
            Get help with your issues and create support tickets by chatting
            with our AI assistant.
          </p>
        </div>
        <div className="w-full flex-1 flex flex-col rounded-2xl bg-white/5 shadow-lg border border-white/[.10] p-0 sm:pt-6 max-h-full overflow-hidden h-full">
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 min-h-0 h-full"
          >
            {messages.length === 0 && (
              <div className="text-center h-full text-muted-foreground py-8 flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <BotMessageSquare className="w-24 h-24 text-gray-300" />
                  <p className="text-muted-foreground/80 text-gray-400 text-center">
                    Start a conversation by typing your message below.
                    <br />
                    Our AI assistant is ready to help!
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[60%] w-fit px-4 py-2 rounded-2xl shadow-sm text-base break-words ${
                  msg.role === "user"
                    ? "ml-auto bg-white/10 text-gray-300 rounded-br-sm"
                    : "mr-auto text-gray-300 border border-white/[.10] rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {isPending && (
              <div className="max-w-[60%] w-fit px-4 py-2 rounded-2xl shadow-sm text-base break-words mr-auto text-gray-500 border border-white/[.10] rounded-bl-sm">
                <span className="mr-1">Assistant is typing</span>
                <span
                  className="mr-0.5 inline-block w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></span>
                <span
                  className="mr-0.5 inline-block w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="inline-block w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            )}
          </div>

          <div className="flex gap-2 items-center border-t border-white/[.10] bg-black/30 px-3 py-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={input}
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 rounded-full border border-solid border-white/[.10] bg-black/20 text-foreground px-4 py-3 font-medium text-base focus:outline-none focus:ring-2 focus:ring-foreground/20 transition"
            />
            <button
              disabled={isPending || !input.trim()}
              onClick={handleSend}
              className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#ccc] font-medium h-9 sm:h-10 px-4 sm:px-5"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
