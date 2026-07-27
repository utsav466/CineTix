import { z } from "zod";

const passwordSchema = z
  .string()
  .min(
    8,
    "Password must contain at least 8 characters",
  )
  .max(
    128,
    "Password must contain fewer than 128 characters",
  )
  .regex(
    /[A-Za-z]/,
    "Password must contain at least one letter",
  )
  .regex(
    /[0-9]/,
    "Password must contain at least one number",
  );

export const CreateUserDTO = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        "Full name must contain at least 2 characters",
      )
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
      .min(
        3,
        "Username must contain at least 3 characters",
      )
      .max(30, "Username is too long")
      .regex(
        /^[a-z0-9._-]+$/,
        "Username contains invalid characters",
      )
      .optional(),

    phone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone number")
      .max(20, "Phone number is too long")
      .optional(),

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const LoginUserDTO = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const ForgotPasswordDTO = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
});

export const ResetPasswordDTO = z
  .object({
    token: z
      .string()
      .min(1, "Reset token is required"),

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type CreateUserInput = z.infer<
  typeof CreateUserDTO
>;

export type LoginUserInput = z.infer<
  typeof LoginUserDTO
>;

export type ForgotPasswordInput = z.infer<
  typeof ForgotPasswordDTO
>;

export type ResetPasswordInput = z.infer<
  typeof ResetPasswordDTO
>;

/*
 * Compatibility names for any old imports.
 */
export type CreateUserDTO =
  CreateUserInput;

export type LoginUserDTO =
  LoginUserInput;