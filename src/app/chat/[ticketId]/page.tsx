"use client";
import { useParams } from "next/navigation";
import React from "react";

export default function TicketChatPage() {
  const params = useParams();
  const ticketId = params?.ticketId;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-2xl font-bold mb-4">Chat for ticket: {ticketId}</h1>
      {/* TODO: Load and display chat for this ticket */}
    </div>
  );
}
