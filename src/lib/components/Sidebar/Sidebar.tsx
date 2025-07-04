"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { TicketSidebar } from "./types";

export default function Sidebar() {
  const [tickets, setTickets] = useState<TicketSidebar[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
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
            className={`bg-white/10 rounded-lg p-3 border border-white/10 text-gray-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              pathname === "/chat"
                ? "bg-white/20 font-bold"
                : "hover:bg-white/20"
            }`}
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
          tickets.map((ticket) => {
            const ticketHref = `/chat/${ticket.id}`;
            const isActive = pathname === ticketHref;
            return (
              <Link
                key={ticket.id}
                href={ticketHref}
                className={`bg-white/10 rounded-lg p-3 border border-white/10 text-gray-300 text-sm font-medium flex flex-col gap-2 mb-0 transition-colors ${
                  isActive ? "bg-white/20 font-bold" : "hover:bg-white/20"
                }`}
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
            );
          })
        )}
      </ul>
    </aside>
  );
}
