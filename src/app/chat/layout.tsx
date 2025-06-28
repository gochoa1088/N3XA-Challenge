"use client";
import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

// Sidebar ticket type
export type TicketSidebar = {
  id: string;
  issue?: string;
  status: string;
  updatedAt: string;
  messages?: { createdAt: string }[];
};

function Sidebar() {
  const [tickets, setTickets] = React.useState<TicketSidebar[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  return (
    <aside className="h-[calc(100vh-96px)] w-64 min-w-56 max-w-xs  border-r border-white/10 flex flex-col p-4 gap-2 overflow-y-auto">
      <h2 className="text-lg font-bold text-white mb-4">Ticket History</h2>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            href="/chat"
            className="bg-white/10 rounded-lg p-3 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </Link>
        </li>
        {loading ? (
          <li className="text-gray-400 text-sm">Loading...</li>
        ) : tickets.length === 0 ? (
          <li className="text-gray-400 text-sm">No tickets yet.</li>
        ) : (
          tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/chat/${ticket.id}`}
              className="bg-white/10 rounded-lg p-3 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/20 transition-colors flex flex-col gap-2 mb-0"
            >
              <span
                className="truncate text-gray-300 text-sm font-medium"
                title={ticket.issue || "No issue"}
              >
                {ticket.issue ? ticket.issue : "No issue"}
              </span>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {ticket.messages && ticket.messages.length > 0
                    ? new Date(
                        ticket.messages[ticket.messages.length - 1].createdAt
                      ).toLocaleDateString()
                    : ticket.updatedAt
                    ? new Date(ticket.updatedAt).toLocaleDateString()
                    : "-"}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${
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
            </Link>
          ))
        )}
      </ul>
    </aside>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-96px)] w-full  flex flex-row items-stretch bg-background">
      <Sidebar />
      <main className="flex-1 p-4 flex flex-col items-center h-full min-h-0">
        {children}
      </main>
    </div>
  );
}
