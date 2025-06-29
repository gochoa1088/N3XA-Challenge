export type TicketSidebar = {
  id: string;
  issue?: string;
  status: string;
  updatedAt: string;
  messages?: { createdAt: string }[];
};
