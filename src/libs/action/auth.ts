"use server"

import { apiFetch } from "../api";
import { cookies } from "next/headers";

interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const { data, headers } = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      fullResponse: true,
    });

    if (data && data.accessToken) {
      const cookieStore = await cookies();
      
      // Save Access Token
      cookieStore.set("token", data.accessToken, {
        path: "/",
        maxAge: 86400, // 1 day
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      // Save Refresh Token from Backend Header
      const setCookie = headers.get("set-cookie");
      if (setCookie) {
        const refreshTokenMatch = setCookie.match(/refreshToken=([^;]+)/);
        if (refreshTokenMatch) {
          cookieStore.set("refreshToken", refreshTokenMatch[1], {
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }
      }
      
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
  cookieStore.delete("refreshToken");
  return { success: true };
}
