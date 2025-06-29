"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BotMessageSquare } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ChatProps, Message, Ticket } from "./types";
import {
  getMessages,
  getTicket,
  sendAdminMessage,
  sendUserMessage,
} from "./utils";

export default function Chat({ ticketId, isAdmin = false }: ChatProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicket(ticketId),
    enabled: !!ticketId && isAdmin,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", ticketId],
    queryFn: () => getMessages(ticketId),
    enabled: !!ticketId && !isAdmin,
  });

  const sendAdminMessageMutation = useMutation({
    mutationFn: (content: string) => sendAdminMessage(ticketId, content),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["ticket", ticketId] });

      const previousTicket = queryClient.getQueryData<Ticket>([
        "ticket",
        ticketId,
      ]);

      if (previousTicket) {
        const optimisticMessage: Message = {
          id: crypto.randomUUID(),
          role: "admin",
          content,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData<Ticket>(["ticket", ticketId], {
          ...previousTicket,
          messages: [...previousTicket.messages, optimisticMessage],
        });
      }

      return { previousTicket };
    },
    onError: (err, content, context) => {
      if (context?.previousTicket) {
        queryClient.setQueryData(["ticket", ticketId], context.previousTicket);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
    },
  });

  const sendUserMessageMutation = useMutation({
    mutationFn: (content: string) => sendUserMessage(ticketId, content),
    onMutate: async (content) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["messages", ticketId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<Message[]>([
        "messages",
        ticketId,
      ]);

      // Optimistically update to show user message immediately
      const optimisticUserMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(
        ["messages", ticketId],
        [...(previousMessages || []), optimisticUserMessage]
      );

      return { previousMessages };
    },
    onError: (err, content, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", ticketId],
          context.previousMessages
        );
      }
    },
    onSuccess: () => {
      // The AI response is already handled by the server and will be included
      // when we refetch the messages, so we just invalidate to get the latest
      queryClient.invalidateQueries({ queryKey: ["messages", ticketId] });
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    if (isAdmin) {
      if (sendAdminMessageMutation.isPending) return;
      sendAdminMessageMutation.mutate(input);
    } else {
      if (sendUserMessageMutation.isPending) return;
      sendUserMessageMutation.mutate(input);
    }

    setInput("");
  };

  const messagesDependency = isAdmin ? ticket?.messages : messages;

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messagesDependency]);

  const isLoading = isAdmin ? ticketLoading : messagesLoading;
  const currentMessages = isAdmin ? ticket?.messages || [] : messages;
  const isPending = isAdmin
    ? sendAdminMessageMutation.isPending
    : sendUserMessageMutation.isPending;

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 flex-1 min-h-0 h-full">
      {/* Welcome message for end-user mode */}
      {!ticketId && !isAdmin && (
        <div className="w-full flex flex-col items-center gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            Welcome to N3XA Support
          </h1>
          <p className="text-muted-foreground text-gray-300 text-center">
            Get help with your issues and create support tickets by chatting
            with our AI assistant.
          </p>
        </div>
      )}

      {/* Chat Area */}
      <div className="w-full flex-1 flex flex-col rounded-2xl bg-white/5 shadow-lg border border-white/[.10] max-h-full overflow-hidden h-full">
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 h-full"
        >
          {isLoading ? (
            <div className="text-center h-full text-muted-foreground py-8 flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <BotMessageSquare className="w-24 h-24 text-gray-300" />
                <p className="text-muted-foreground/80 text-gray-400 text-center">
                  Loading conversation...
                </p>
              </div>
            </div>
          ) : currentMessages.length === 0 ? (
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
          ) : null}

          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[60%] w-fit px-4 py-2 rounded-2xl shadow-sm text-base break-words ${
                msg.role === "user"
                  ? "ml-auto bg-white/10 text-white rounded-br-sm"
                  : msg.role === "admin"
                  ? "mr-auto bg-blue-900 text-gray-300 rounded-br-sm"
                  : "mr-auto text-gray-300 border border-white/[.10] rounded-bl-sm"
              }`}
            >
              {isAdmin && (
                <div className="text-xs font-semibold mb-1 opacity-80">
                  {msg.role === "user"
                    ? ticket?.name || "Customer"
                    : msg.role === "admin"
                    ? "Support Agent"
                    : "AI Assistant"}
                </div>
              )}
              {msg.content}
              {isAdmin && msg.createdAt && (
                <div className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              )}
            </div>
          ))}

          {isPending && (
            <div className="max-w-[60%] w-fit px-4 py-2 rounded-2xl shadow-sm text-base break-words mr-auto text-gray-500 border border-white/[.10] rounded-bl-sm">
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
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isPending}
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
  );
}
