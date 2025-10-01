import Link from "next/link"

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Logo Image */}
      <div className="relative">
        <img
          src="/logo-without-bg.png"
          alt="Le Duc Pizzeria"
          className="h-15 w-15 md:h-12 md:w-12 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="font-serif italic text-lg md:text-xl text-white transition-colors duration-300">
          Pizza
        </span>
        <span className="text-[10px] md:text-xs text-white/70 font-light tracking-[0.2em] uppercase">Le Duc</span>
      </div>
    </Link>
  )
}

export default Logo
