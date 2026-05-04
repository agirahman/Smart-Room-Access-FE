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