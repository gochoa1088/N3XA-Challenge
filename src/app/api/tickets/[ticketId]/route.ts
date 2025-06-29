import { NextRequest, NextResponse } from "next/server";
import { Ticket } from "@/lib/models/ticket";

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { ticketId } = await params;
    const ticket = await Ticket.get(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    return NextResponse.json({ ticket });
  } catch (err) {
    console.error("Ticket API Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
