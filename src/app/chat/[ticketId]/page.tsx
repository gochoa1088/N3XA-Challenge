"use client";
import { useParams } from "next/navigation";
import Chat from "../Chat";

export default function TicketChatPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  return <Chat ticketId={ticketId} />;
}
