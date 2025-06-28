// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/lib/models/message";
import { Ticket } from "@/lib/models/ticket";
import { Role } from "../../../generated/prisma/client";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

const SYSTEM_PROMPT = `
You are an AI assistant helping users submit support tickets.
Your goal is to gather:
1. Their full name
2. A detailed description of the issue
3. The category of the issue (suggest one if unclear)

Only ask one question at a time. When all information is collected, call the submit_ticket function with the user's name, issue, and category.

Keep responses friendly and conversational.
`;

const SYSTEM_FUNCTIONS = [
  {
    name: "submit_ticket",
    description: "Submit a support ticket with user info",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "The user's full name" },
        issue: {
          type: "string",
          description: "A detailed description of the issue",
        },
        category: { type: "string", description: "The issue category" },
      },
      required: ["name", "issue", "category"],
    },
  },
];

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

    // Prepare messages for OpenAI
    const openaiMessages: {
      role: "system" | "user" | "assistant";
      content: string;
    }[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === Role.user ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

    // Call OpenAI API with function calling
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: openaiMessages,
      functions: SYSTEM_FUNCTIONS,
      function_call: "auto",
      max_tokens: 200,
      temperature: 0.7,
    });

    const choice = completion.choices[0];
    let assistantReply = choice.message.content || "";

    // If function_call is present, parse and update ticket
    if (
      choice.message.function_call &&
      choice.message.function_call.name === "submit_ticket"
    ) {
      try {
        const args = JSON.parse(choice.message.function_call.arguments || "{}");
        await Ticket.update(ticket.id, {
          name: args.name,
          issue: args.issue,
          category: args.category,
          status: "SUBMITTED",
        });
        assistantReply = "Thanks, I have submitted your ticket.";
      } catch {
        // fallback: show error or continue
        assistantReply = "Sorry, there was an error submitting your ticket.";
      }
    }

    await Message.add(ticket.id, Role.assistant, assistantReply);

    return NextResponse.json({ reply: assistantReply });
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
