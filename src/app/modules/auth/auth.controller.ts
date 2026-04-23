import { Request, Response } from "express";
import { catchAsync } from "../shared/catchAsync";
import { tokenUtils } from "../../utils/token";
import { sendResponse } from "../shared/sendResponse";

import { authService } from "./auth.service";
import { CookieUtils } from "../../utils/cookie";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { auth } from "../../lib/auth";
import { IRequestUser } from "../../interface";




const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;
  // console.log(result);

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res,await refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res,   refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
   httpStatusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const betterAuthToken = req.cookies["better-auth.session_token"];
  const result = await authService.logOut(betterAuthToken);

  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.forgetPassword(req.body.email);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Forgot password successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  const result = await authService.resetPassword(email, newPassword, otp);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Reset password successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const sessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.changePassword(payload, sessionToken);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res,await  refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const {email, otp } = req.body;
  const result = await authService.verifyEmail(email, otp);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Email verified successfully",
    data: result,
  });
});

const sendVerifyOtp = catchAsync(async (req: Request, res: Response) => {
  const {email, type } = req.body;

  const result = await authService.verifyEmail(email, type);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Verify otp sent successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.getMe(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthToken = req.cookies["better-auth.session_token"];

  if (!refreshToken) {
    throw new AppError(status.UNAUTHORIZED, "Refresh token not found");
  }

  const result = await authService.getNewToken(refreshToken, betterAuthToken);
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, await  newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "New token generated successfully",
    data: {
      sessionToken,
      accessToken,
      refreshToken: newRefreshToken,
    },
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect || "/";
  const encodedRedirectPath = encodeURIComponent(redirectPath as string);

  const callbackUrl = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

  res.render("googleRedirect", {
    callbackURL: callbackUrl,
    betterAuthUrl: envVars.BETTER_AUTH_URL,
  });
});

const googleSuccess = catchAsync(async (req, res) => {
  const redirectPath = (req.query.redirect as string) || "/";
  const sessionToken = req.cookies["better-auth.session_token"];

  if (!sessionToken) {
    return res.redirect(`${envVars.BETTER_AUTH_URL}/login?error=oauth_failed`);
  }

  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session) {
    return res.redirect(
      `${envVars.BETTER_AUTH_URL}/login?error=no_session_found`,
    );
  }

  if (session && !session.user) {
    return res.redirect(`${envVars.BETTER_AUTH_URL}/login?error=no_user_found`);
  }

  const result = await authService.googleLoginSuccess(session);

  const { accessToken, refreshToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res,await  refreshToken);

  const isValidRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/";

  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});

const handleOAuthError = catchAsync((req: Request, res: Response) => {
  const error = (req.query.error as string) || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});

export const AuthController = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  getMe,
  getNewToken,
  handleOAuthError,
  googleLogin,
  googleSuccess,
  sendVerifyOtp,
};