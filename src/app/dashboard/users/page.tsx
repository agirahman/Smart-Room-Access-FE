import UserPage from "@/components/(Users)";
import { getUsers } from "@/libs/action/data";

const page = async ({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; role?: string; page?: string }> 
}) => {
  const users = await getUsers();
  const resolvedParams = await searchParams;

  return (
    <UserPage 
      initialUsers={users} 
      searchParams={resolvedParams} 
    />
  )
}

export default page