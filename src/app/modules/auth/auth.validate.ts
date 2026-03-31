import z from "zod";


const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),
});

const registerSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  // ),
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters long"),
  role: z.enum(["USER", "ADMIN"], "Role is required"),
  acceptTerms: z.boolean("Accept Terms and Condition must be true"),
  rememberMe: z.boolean().optional(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters long"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  // ),
});

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email"),
});

const resetPasswordSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
  // ),
  token: z.string("Token is required"),
});

const verifyEmailSchema = z.object({
  email: z.email("Invalid email"),
  otp: z.string("OTP is required"),
});

const sendVerifyOtpSchema = z.object({
  email: z.email("Invalid email"),
  type: z.enum(
    ["sign-in", "email-verification", "forget-password", "change-email"],
    "Type is required",
  ),
});

export const AuthValidation = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  sendVerifyOtpSchema,
};