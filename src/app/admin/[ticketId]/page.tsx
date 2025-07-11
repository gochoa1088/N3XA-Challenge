"use client";
import React, { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import Link from "next/link";
import Chat from "@/lib/components/Chat/Chat";
import { Ticket } from "./types";
import { closeTicket, getTicket } from "./utils";

const TicketDetailPage = ({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) => {
  const { ticketId } = use(params);
  const queryClient = useQueryClient();

  const {
    data: ticket,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicket(ticketId),
  });

  const closeTicketMutation = useMutation({
    mutationFn: () => closeTicket(ticketId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["ticket", ticketId] });

      const previousTicket = queryClient.getQueryData<Ticket>([
        "ticket",
        ticketId,
      ]);

      if (previousTicket) {
        queryClient.setQueryData<Ticket>(["ticket", ticketId], {
          ...previousTicket,
          status: "CLOSED",
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
      queryClient.invalidateQueries({ queryKey: ["tickets", "review"] });
    },
  });

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-96px)] bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading ticket...</div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="h-[calc(100vh-96px)] bg-background flex items-center justify-center">
        <div className="text-red-400">
          {error instanceof Error ? error.message : "Ticket not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-96px)] w-full flex flex-row items-stretch bg-background">
      <main className="flex-1 p-4 flex flex-col items-center h-full min-h-0">
        <div className="w-full max-w-4xl flex flex-col gap-6 flex-1 min-h-0">
          <div className="w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-center">
              Ticket #{ticket.id.slice(0, 8)}
            </h1>
          </div>

          <div className="w-full p-4 rounded-2xl bg-white/5 shadow-lg border border-white/[.10]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <span className="font-semibold text-white/90">Customer:</span>{" "}
                <span className="text-white/80">
                  {ticket.name || "Unknown"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-white/90">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
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
              <div>
                <span className="font-semibold text-white/90">Category:</span>{" "}
                <span className="text-white/80">{ticket.category || "-"}</span>
              </div>
              <div>
                <span className="font-semibold text-white/90">Created:</span>{" "}
                <span className="text-white/80">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-semibold text-white/90">Issue:</span>{" "}
                <span className="text-white/80">{ticket.issue || "-"}</span>
              </div>
              {ticket.status !== "CLOSED" && (
                <button
                  onClick={() => closeTicketMutation.mutate()}
                  disabled={closeTicketMutation.isPending}
                  className="w-fit cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-red-200 font-medium h-9 sm:h-10 px-4 sm:px-5"
                >
                  <X className="w-4 h-4" />
                  {closeTicketMutation.isPending
                    ? "Closing..."
                    : "Close Ticket"}
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <Chat ticketId={ticketId} isAdmin={true} />
          </div>

          {ticket.status === "CLOSED" && (
            <div className="text-center text-green-400 font-semibold py-2">
              This ticket has been closed
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TicketDetailPage;
