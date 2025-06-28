import Chat from "../Chat";

export default async function TicketChatPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  return <Chat ticketId={ticketId} />;
}
