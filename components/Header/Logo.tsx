import Link from "next/link"

interface LogoProps {
  variant?: 'transparent' | 'solid';
}

const Logo = ({ variant = 'transparent' }: LogoProps) => {
  const isTransparent = variant === 'transparent';
  
  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Logo Image */}
      <div className="relative">
        <img
          src="/logo-without-bg.png"
          alt="Le Duc Pizzeria"
          className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className={`font-serif italic text-lg md:text-xl transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
          Pizza
        </span>
        <span className={`text-[10px] md:text-xs font-light tracking-[0.2em] uppercase ${isTransparent ? 'text-white/70' : 'text-gray-600'}`}>Le Duc</span>
      </div>
    </Link>
  )
}

export default Logo
