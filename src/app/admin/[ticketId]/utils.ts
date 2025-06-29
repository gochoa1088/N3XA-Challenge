export const getTicket = async (ticketId: string) => {
  const res = await fetch(`/api/tickets/${ticketId}`);
  const data = await res.json();
  if (!data.ticket) {
    throw new Error("Ticket not found");
  }
  return data.ticket;
};

export const closeTicket = async (ticketId: string) => {
  const res = await fetch(`/api/tickets/${ticketId}/close`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to close ticket");
  }
  return res.json();
};
