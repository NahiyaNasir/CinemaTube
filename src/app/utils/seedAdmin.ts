import dotenv from "dotenv";
dotenv.config();

import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
try {
    const isDefaultAdminExist = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });

    if (isDefaultAdminExist) {
      console.log("Default admin already exist. Skipping seeding Default-Admin.");
      return;
    }

    const defaultAdminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.ADMIN_EMAIL,
        password: envVars.ADMIN_PASSWORD,
        name: "Default Admin",
        role: Role.ADMIN,
        needPasswordChange: false,
        rememberMe: false,
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: defaultAdminUser.user.id,
        },
        data: {
          status: UserStatus.ACTIVE,
          emailVerified: true,
        },
      });

      await tx.admin.create({
        data: {
          userId: defaultAdminUser.user.id,
          name: "Default Admin",
          email: envVars.ADMIN_EMAIL,
        },
      });
    });
    const defaultAdmin = await prisma.admin.findFirst({
      where: {
        email: envVars.ADMIN_EMAIL,
      },
      include: {
        user: true,
      },
    });

    console.log(`Default Admin created:`, defaultAdmin);
  } catch (error: any) {
    console.error(`Error seeding default admin: `, error);
    await prisma.user.delete({
      where: {
        email: envVars.ADMIN_EMAIL,
      },
    });
  }
}