export type UserRole =
  | "user"
  | "admin";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone?: string;
  role: UserRole;
  preferredCurrency:
    | "NPR"
    | "USD"
    | "INR";
  avatarUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResult = {
  user: AuthUser;
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  phone?: string;
  username?: string;
  password: string;
  confirmPassword: string;
};

export type AuthApiResponse = {
  success: true;
  message: string;
  data: AuthResult;
};

export type CurrentUserResponse = {
  success: true;
  data: {
    user: AuthUser;
  };
};