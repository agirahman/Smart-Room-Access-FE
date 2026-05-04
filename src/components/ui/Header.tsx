import { HeaderProps } from "@/types/types"

const Header = ({ title, description}: HeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
      <p className="text-zinc-400 mt-2">{description}</p>
    </div>
  )
}

export default Header