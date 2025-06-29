export type Message = {
  id: string;
  role: "user" | "assistant" | "admin";
  content: string;
  createdAt?: string;
};

export interface Ticket {
  id: string;
  name?: string;
  issue?: string;
  category?: string;
  status: string;
  createdAt: string;
  messages: Message[];
}

export interface ChatProps {
  ticketId?: string;
  isAdmin?: boolean;
}
