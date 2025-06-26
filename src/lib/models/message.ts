import prisma from "@/lib/prisma";
import { Role } from "../../generated/prisma/client";

export class Message {
  static async add(ticketId: string, role: Role, content: string) {
    return prisma.message.create({
      data: {
        ticketId,
        role,
        content,
      },
    });
  }

  static async list(ticketId: string) {
    return prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
    });
  }

  static async get(id: string) {
    return prisma.message.findUnique({
      where: { id },
    });
  }

  static async delete(id: string) {
    return prisma.message.delete({
      where: { id },
    });
  }

  // Optional: create many messages at once
  static async bulkAdd(
    ticketId: string,
    messages: { role: Role; content: string }[]
  ) {
    return prisma.message.createMany({
      data: messages.map((m) => ({
        ticketId,
        role: m.role,
        content: m.content,
      })),
    });
  }
}
