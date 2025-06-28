import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/lib/models/message";
import { Role } from "@/generated/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const { content } = await req.json();
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const message = await Message.add(params.ticketId, Role.admin, content);
    return NextResponse.json({ message });
  } catch (err) {
    console.error("Admin Message API Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
