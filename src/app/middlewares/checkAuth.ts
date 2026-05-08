



import status from "http-status";
import AppError from "../errorHelpers/AppError";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";
import { CookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { NextFunction, Request, Response } from "express";

export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        //Session Token Verification
        const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
//   console.log("🔍 Session Token:", sessionToken ? "✅ Found" : "❌ Missing");
        if (!sessionToken) {
            throw new Error('Unauthorized access! No session token provided.');
        }

        if (sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date(),
                    }
                },
                include: {
                    user: true,
                }
            })
 // console.log("🔍 Session Found:", sessionExists ? "✅ Yes" : "❌ No");
        // console.log("🔍 Session User:", sessionExists?.user ? "✅ User attached" : "❌ No user");
            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user;

                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt)
                const createdAt = new Date(sessionExists.createdAt)

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

                if (percentRemaining < 20) {
                    res.setHeader('X-Session-Refresh', 'true');
                    res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
                    res.setHeader('X-Time-Remaining', timeRemaining.toString());

                    console.log("Session Expiring Soon!!");
                }

                if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                    throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is not active.');
                }

                if (user.isDeleted) {
                    throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is deleted.');
                }

                if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                    throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
                }
if (!sessionExists || !sessionExists.user) {
    throw new AppError(status.UNAUTHORIZED, 'Session not found or expired');
}
                req.user = {
                    userId : user.id,
                    role : user.role,
                    email : user.email,
                    status: user.status,
                    name: user.name,
                    isDeleted: user.isDeleted,

                    
                }
            }

            const accessToken = CookieUtils.getCookie(req, 'accessToken');
// console.log("🔍 Access Token:", accessToken ? "✅ Found" : "❌ Missing");
            if (!accessToken) {
                throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
            }


        }

        //Access Token Verification
        const accessToken = CookieUtils.getCookie(req, 'accessToken');

        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
        }

        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
// console.log("🔍 Token Verified:", verifiedToken.success ? "✅ Yes" : "❌ No", verifiedToken);
        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid access token.');
        }

        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as Role)) {
            throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
        }



//         req.user = {
//     userId: verifiedToken.data!.userId as string,
//     role: verifiedToken.data!.role as Role,
//     email: verifiedToken.data!.email as string,
//     status: verifiedToken.data!.status as UserStatus,
//     name: verifiedToken.data!.name as string,
//     isDeleted: verifiedToken.data!.isDeleted as boolean,
// };
// console.log("🔍 req.user before next():", req.user);
        next()
    } catch (error: any) {
        next(error);
    }
};