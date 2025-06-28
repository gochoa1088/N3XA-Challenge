import { NextResponse } from "next/server";
import { Ticket } from "@/lib/models/ticket";
import { TicketStatus } from "@/generated/prisma";

export async function GET() {
  try {
    const tickets = await Ticket.listByStatuses([
      TicketStatus.SUBMITTED,
      TicketStatus.CLOSED,
    ]);
    return NextResponse.json({ tickets });
  } catch (err) {
    console.error("Tickets API Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
