export interface MenuItems {
  href: string;
  icon: React.JSX.Element;
  label: string;
}

export interface NewUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface EmailVerifyRequest {
  token: string;
  userId: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ForgetPassword {
  email: string;
}

export interface UpdatePassword {
  password: string;
  token: string;
  userId: string;
}

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  verified: boolean;
}
