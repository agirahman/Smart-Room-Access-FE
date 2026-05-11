export const getToken = async (): Promise<string | undefined> => {
  if (typeof window === 'undefined') {
    try {
      const mod = await import('next/headers')
      const cookieStore = await mod.cookies();
      return cookieStore.get('token')?.value
    } catch {
      // If dynamic import fails (non-app router), return undefined
      return undefined
    }
  }

  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1]
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
