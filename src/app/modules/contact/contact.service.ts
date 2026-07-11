import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createContactMessage = async (
  payload: Prisma.ContactMessageCreateInput,
) => {
  const result = await prisma.contactMessage.create({
    data: payload,
  });
  return result;
};

const getAllContactMessages = async (query: Record<string, unknown>) => {
  const contactQuery = new QueryBuilder(prisma.contactMessage, query as any, {
    searchableFields: ["name", "email", "message"],
    filterableFields: ["isRead"],
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await contactQuery.execute();
  return result;
};

const markContactMessageAsRead = async (id: string) => {
  const isExist = await prisma.contactMessage.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Contact message not found");
  }

  const result = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
  return result;
};

const deleteContactMessage = async (id: string) => {
  const isExist = await prisma.contactMessage.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "Contact message not found");
  }

  const result = await prisma.contactMessage.delete({ where: { id } });
  return result;
};

export const ContactService = {
  createContactMessage,
  getAllContactMessages,
  markContactMessageAsRead,
  deleteContactMessage,
};