"use server"

import { apiFetch } from "../api";
import { setToken, removeToken } from "../cookies";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const response = await apiFetch<{ success: boolean; data: { token: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.data.token) {
      // Set token in cookies (Server Side)
      const cookieStore = await cookies();
      cookieStore.set("token", response.data.token, {
        path: "/",
        maxAge: 86400, // 1 day
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return { success: true };
    }
    
    return { success: false, message: "Login failed" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return { success: true };
}
