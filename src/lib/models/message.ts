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
}
