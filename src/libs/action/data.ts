"use server"

import { apiFetch } from "../api";

export interface User {
  id: number;
  name: string;
  rfid_uid: string;
  username?: string;
  role: 'student' | 'staff' | 'admin';
  schedule_start: string;
  schedule_end: string;
  valid_until: string;
}

export interface AccessLog {
  id: number;
  user_id: number;
  user_name?: string; // from join
  name?: string; // from join
  room: string;
  status: 'allowed' | 'denied';
  photo_url?: string;
  access_time: string;
}


export interface LogsResponse {
  logs: AccessLog[];
}

export interface UsersResponse {
  users: User[];
}

export async function getUsers(): Promise<User[]> {
  try {
    // Backend returns { users: [...] } inside the data property if using sendResponse helper
    const response = await apiFetch<{ users: User[] }>("/users");
    return response.users || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function getLogs(): Promise<LogsResponse> {
  try {
    const response = await apiFetch<LogsResponse>("/logs");
    return response;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return { logs: [] };
  }
}

export async function createUser(userData: Partial<User>) {
  try {
    const response = await apiFetch<{ user: User }>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return { success: true, message: "", ...response };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export async function updateUser(id: number, userData: Partial<User>) {
  try {
    const response = await apiFetch<{ user: User }>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    return { success: true, message: "", ...response };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}

export interface DashboardStats {
  summary: {
    total: number;
    allowed: number;
    denied: number;
    users: number;
  };
  trend: {
    label: string;
    count: number;
    allowed: number;
    denied: number;
  }[];
  roomStats: {
    room: string;
    count: number;
  }[];
  roleStats: {
    role: string;
    count: number;
  }[];
}

export async function getDashboardStats(range: string = 'today'): Promise<DashboardStats | null> {
  try {
    const response = await apiFetch<DashboardStats>(`/dashboard/stats?range=${range}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await apiFetch<{ user: User | null }>(`/users/${id}`, {
      method: "DELETE",
    });
    return { success: true, message: "", ...response };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred" };
  }
}
