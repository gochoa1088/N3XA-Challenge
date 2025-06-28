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
    <div className="h-[calc(100vh-96px)] bg-background flex flex-col w-full items-center p-4">
      <div className="w-full max-w-4xl flex flex-col gap-8 flex-1 min-h-0">
        <div className="w-full flex flex-col items-center gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            Support Ticket Dashboard
          </h1>
          <p className="text-muted-foreground text-gray-300 text-center">
            Manage and review support tickets from customers in real-time.
          </p>
        </div>
        <div className="p-4 w-full flex-1 flex flex-col rounded-2xl bg-white/5 shadow-lg border border-white/[.10] sm:pt-6 min-h-[400px] max-h-full overflow-hidden">
          <h2 className="text-xl font-semibold  mb-6">Recent Tickets</h2>

          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">
              <p>{error}</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>
                No tickets available. Tickets will appear here when customers
                submit them.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="border border-white/[.10] rounded-lg p-4 bg-white/5 flex flex-col gap-2"
                >
                  <div className="flex flex-wrap gap-4 items-center justify-between">
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
  );
};

export default TicketReviewPage;
