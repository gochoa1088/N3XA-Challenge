import { Message, Ticket } from "./types";

export const getTicket = async (
  ticketId: string | undefined
): Promise<Ticket> => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }
  const res = await fetch(`/api/tickets/${ticketId}`);
  const data = await res.json();
  if (!data.ticket) {
    throw new Error("Ticket not found");
  }
  return data.ticket;
};

export const getMessages = async (
  ticketId: string | undefined
): Promise<Message[]> => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }
  const res = await fetch(`/api/tickets/${ticketId}`);
  const data = await res.json();
  return data.ticket.messages;
};

export const sendAdminMessage = async (
  ticketId: string | undefined,
  content: string
): Promise<Message> => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }
  const res = await fetch(`/api/tickets/${ticketId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error("Failed to send message");
  }
  const data = await res.json();
  return data.message;
};

export const sendUserMessage = async (
  ticketId: string | undefined,
  content: string
): Promise<{ reply: string }> => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      ticketId ? { message: content, ticketId } : { message: content }
    ),
  });
  if (!res.ok) {
    throw new Error("Failed to send message");
  }
  const data = await res.json();
  return data;
};
