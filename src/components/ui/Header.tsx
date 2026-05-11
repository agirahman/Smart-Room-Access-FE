import { HeaderProps } from "@/types/types"

const Header = ({ title, description}: HeaderProps) => {
  return (
    <div className="mb-8">
      <h1 
        className="text-hero font-bold tracking-tight mb-2"
        style={{ 
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          fontSize: '28px',
          fontWeight: '800',
          lineHeight: '1.1'
        }}
      >
        {title}
      </h1>
      <p 
        className="mt-2"
        style={{ 
          fontFamily: 'var(--font-body)',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          fontWeight: '400',
          lineHeight: '1.5'
        }}
      >
        {description}
      </p>
    </div>
  )
}

export default Header