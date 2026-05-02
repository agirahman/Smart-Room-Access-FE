import LogsPage from "@/components/(Logs)"
import { LogsPageProps } from "@/types/types"

const page = ({ searchParams }: LogsPageProps) => {
  return (
    <LogsPage searchParams={searchParams} />
  )
}


export default page