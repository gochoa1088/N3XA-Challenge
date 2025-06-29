export interface Ticket {
  id: string;
  name?: string;
  issue?: string;
  category?: string;
  status: string;
  createdAt: string;
  messages: {
    id: string;
    role: "user" | "assistant" | "admin";
    content: string;
    createdAt: string;
  }[];
}
