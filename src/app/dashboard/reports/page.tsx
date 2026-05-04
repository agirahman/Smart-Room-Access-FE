import ReportsPage from "@/components/(Reports)"

const page = ({ searchParams }: { searchParams: Promise<{ start?: string; end?: string }> }) => {
  return (
    <ReportsPage searchParams={searchParams} />
  )
}

export default page