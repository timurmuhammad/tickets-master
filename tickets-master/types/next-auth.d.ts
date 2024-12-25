import { DefaultUser } from "next-auth";

type CustomUser = {
  id: string
  role: string
  username: string
  email: string
  password: string
  salt: string
}

declare module "next-auth" {
  interface User extends CustomUser {}

  interface Session {
    user: User;
  }
}