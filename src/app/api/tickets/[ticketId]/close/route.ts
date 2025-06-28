import { NextRequest, NextResponse } from "next/server";
import { Ticket } from "@/lib/models/ticket";
import { TicketStatus } from "@/generated/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const ticket = await Ticket.update(params.ticketId, {
      status: TicketStatus.CLOSED,
    });
    return NextResponse.json({ ticket });
  } catch (err) {
    console.error("Close Ticket API Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  return POST(req, { params });
}
