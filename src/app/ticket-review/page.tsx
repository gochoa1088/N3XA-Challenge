"use client";
import React, { useEffect, useState } from "react";

interface Ticket {
  id: string;
  name?: string;
  issue?: string;
  category?: string;
  status: string;
  createdAt: string;
}

const TicketReviewPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-2 py-8">
      <div className="w-full max-w-4xl flex flex-col gap-8 flex-1 min-h-0">
        {/* Header Section */}
        <div className="w-full flex flex-col items-center gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            Support Ticket Dashboard
          </h1>
          <p className="text-muted-foreground text-gray-300 text-center">
            Manage and review support tickets from customers in real-time.
          </p>
        </div>
        {/* Tickets Area */}
        <div className="w-full flex-1 flex flex-col rounded-2xl bg-white/5 shadow-lg border border-white/[.10] p-0 sm:pt-6 min-h-[400px] max-h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6 px-6">
            <h2 className="text-xl font-semibold">Recent Tickets</h2>
            <button
              className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-9 sm:h-10 px-4 sm:px-5"
              onClick={fetchTickets}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 min-h-0">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Loading tickets...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-8">
                <p>{error}</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center h-full text-muted-foreground py-8 flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <svg
                    className="w-24 h-24 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6l4 2m6 4.5V19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h7.5M16 3v4a1 1 0 001 1h4"
                    />
                  </svg>
                  <p className="text-muted-foreground/80 text-gray-400 text-center">
                    No tickets available. Tickets will appear here when
                    customers submit them.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="border border-white/[.10] rounded-2xl p-6 bg-white/10 flex flex-col gap-2 shadow-sm"
                  >
                    <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
                      <span className="font-semibold text-lg text-white/90">
                        {ticket.name || "Unknown User"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
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
                    <div className="text-sm text-white/80">
                      <span className="font-semibold">Issue:</span>{" "}
                      {ticket.issue || "-"}
                    </div>
                    <div className="text-sm text-white/80">
                      <span className="font-semibold">Category:</span>{" "}
                      {ticket.category || "-"}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      Created: {new Date(ticket.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketReviewPage;
