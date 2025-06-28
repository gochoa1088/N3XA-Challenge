"use client";

import { useMutation } from "@tanstack/react-query";
import { BotMessageSquare, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type TicketSidebar = {
  id: string;
  issue?: string;
  status: string;
  updatedAt: string;
  messages?: { createdAt: string }[];
};

function Sidebar() {
  const [tickets, setTickets] = useState<TicketSidebar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  return (
    <aside className="h-[calc(100vh-96px)] w-64 min-w-56 max-w-xs  border-r border-white/10 flex flex-col p-4 gap-2 overflow-y-auto">
      <h2 className="text-lg font-bold text-white mb-4">Ticket History</h2>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            href="/chat"
            className="bg-white/10 rounded-lg p-3 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </Link>
        </li>
        {loading ? (
          <li className="text-gray-400 text-sm">Loading...</li>
        ) : tickets.length === 0 ? (
          <li className="text-gray-400 text-sm">No tickets yet.</li>
        ) : (
          tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="bg-white/10 rounded-lg p-3 flex flex-col gap-2 border border-white/10"
            >
              <span
                className="truncate text-gray-300 text-sm font-medium"
                title={ticket.issue || "No issue"}
              >
                {ticket.issue ? ticket.issue : "No issue"}
              </span>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {ticket.messages && ticket.messages.length > 0
                    ? new Date(
                        ticket.messages[ticket.messages.length - 1].createdAt
                      ).toLocaleDateString()
                    : ticket.updatedAt
                    ? new Date(ticket.updatedAt).toLocaleDateString()
                    : "-"}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${
                    ticket.status === "OPEN"
                      ? "bg-yellow-100 text-yellow-800"
                      : ticket.status === "SUBMITTED"
                      ? "bg-blue-100 text-blue-800"
                      : ticket.status === "CLOSED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}

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
    <div className="h-[calc(100vh-96px)] w-full  flex flex-row items-stretch bg-background">
      <Sidebar />
      <main className="flex-1 p-4 flex flex-col items-center h-full min-h-0">
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
    </div>
  );
}
