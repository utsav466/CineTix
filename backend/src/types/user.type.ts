import { z } from "zod";

export const UserRoleSchema = z.enum([
  "user",
  "admin",
]);

export type UserRole = z.infer<
  typeof UserRoleSchema
>;

export const UserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must contain at least 2 characters")
    .max(80, "Full name is too long"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must contain at least 3 characters")
    .max(30, "Username is too long")
    .regex(
      /^[a-z0-9._-]+$/,
      "Username can contain letters, numbers, dots, underscores and hyphens",
    ),

  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number is too long")
    .optional(),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password is too long"),

  role: UserRoleSchema.default("user"),

  preferredCurrency: z
    .enum(["NPR", "USD", "INR"])
    .default("NPR"),

  avatarUrl: z
    .string()
    .trim()
    .optional(),

  isActive: z
    .boolean()
    .default(true),
});

export type UserType = z.infer<
  typeof UserSchema
>;