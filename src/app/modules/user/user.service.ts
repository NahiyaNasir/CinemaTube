import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";



const getAllUsers = async (query: Record<string, unknown> = {}) => {
  const userQuery = new QueryBuilder(prisma.user, query as any, {
    searchableFields: ["name", "email"],
    filterableFields: ["role", "status", "emailVerified"],
  })
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.execute();
  return result;
};

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const updateProfile = async (id: string, data: Record<string, any>) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

const changeStatus = async (
  id: string,
  payload: {
    status: UserStatus;
  },
) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (user.status === payload.status) {
    throw new AppError(status.BAD_REQUEST, "User is already in this status");
  }

  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  changeStatus,
};