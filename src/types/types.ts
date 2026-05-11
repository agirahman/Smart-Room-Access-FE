export interface LogsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    order?: 'asc' | 'desc';
    start?: string;
    end?: string;
    page?: string;
  }>
}

export interface HeaderProps {
  title: string;
  description: string;
}

export type AccessEvent = {
  user_id: number | null
  uid: string
  status: 'allowed' | 'denied'
  room: string
  message: string
  photo_url?: string | null
  timestamp: string
  user_name?: string | null
  user_role?: string | null
}