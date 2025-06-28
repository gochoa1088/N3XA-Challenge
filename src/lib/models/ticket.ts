import prisma from "@/lib/prisma";
import { Role, TicketStatus } from "../../generated/prisma/client";

export class Ticket {
  static async add() {
    return prisma.ticket.create({
      data: {},
      include: {
        messages: true,
      },
    });
  }

  static async get(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
      issue?: string;
      category?: string;
      status?: TicketStatus;
    }
  ) {
    return prisma.ticket.update({
      where: { id },
      data,
    });
  }

  static async addMessage(ticketId: string, role: Role, content: string) {
    return prisma.message.create({
      data: {
        ticketId,
        role,
        content,
      },
    });
  }

  static async getWithMessages(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  static async findOpen() {
    return prisma.ticket.findFirst({
      where: { status: "OPEN" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  static async listSubmitted() {
    return prisma.ticket.findMany({
      where: { status: "SUBMITTED" },
      orderBy: { createdAt: "desc" },
    });
  }

  static async list() {
    return prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
