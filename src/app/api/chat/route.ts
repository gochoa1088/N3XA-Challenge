// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/lib/models/message";
import { Ticket } from "@/lib/models/ticket";
import { Role } from "../../../generated/prisma/client";

function extractContent(messages: { role: string; content: string }[]) {
  return messages.map((m) => m.content.toLowerCase());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message: userMessage } = body;

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    let ticket = await Ticket.findOpen();
    if (!ticket) ticket = await Ticket.add();

    await Message.add(ticket.id, Role.user, userMessage);

    const messages = await Message.list(ticket.id);
    const history = extractContent(messages);
    const alreadyAsked = (str: string) => history.some((c) => c.includes(str));

    // Mock assistant reply
    let assistantReply = "";
    if (!alreadyAsked("your name")) {
      assistantReply = "Sure! Let's get started. What's your full name?";
    } else if (!alreadyAsked("issue") && alreadyAsked("name")) {
      assistantReply =
        "Got it. Can you describe the issue you're experiencing?";
    } else if (!alreadyAsked("category") && alreadyAsked("issue")) {
      assistantReply =
        "Thanks. What category best fits this issue? (e.g. Login, Billing, Tech)";
    } else {
      assistantReply =
        "Thank you! Your support ticket has been submitted. Our team will reach out soon.";

      const name = messages.find(
        (m) => m.role === Role.user && m.content.split(" ").length > 1
      )?.content;
      const issue = messages.find((m) =>
        m.content.toLowerCase().includes("issue")
      )?.content;
      const category = messages.find(
        (m) =>
          m.content.toLowerCase().includes("login") ||
          m.content.toLowerCase().includes("billing") ||
          m.content.toLowerCase().includes("tech")
      )?.content;

      await Ticket.update(ticket.id, {
        name: name || "Unknown",
        issue: issue || "Not provided",
        category: category || "Uncategorized",
        status: "SUBMITTED",
      });
    }

    await Message.add(ticket.id, Role.assistant, assistantReply);

    return NextResponse.json({ reply: assistantReply });
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
