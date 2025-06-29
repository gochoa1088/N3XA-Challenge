import prisma from "@/lib/prisma";
import { TicketStatus } from "../../generated/prisma/client";

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
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
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

  static async list() {
    return prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async listByStatuses(statuses: TicketStatus[]) {
    return prisma.ticket.findMany({
      where: {
        status: { in: statuses },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
