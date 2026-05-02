import { cookies } from "next/headers"

export const getToken = async (): Promise<string | undefined> => {
  if (typeof window === 'undefined') {
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value;
  }
  
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
}

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
  }
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    document.cookie = `token=; path=/; max-age=0`;
  }
}