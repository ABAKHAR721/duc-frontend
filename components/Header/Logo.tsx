import Link from 'next/link';

const Logo = () => {
  return (
    <div className="flex items-center group">
      {/* La classe "space-x-20" a été supprimée et "md:space-x-3" a été remplacée par "sm:space-x-3" */}
      <Link href="/" className="relative flex items-center  sm:space-x-3 px-3 py-2 md:px-4 md:py-2 rounded-xl bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 shadow-md hover:shadow-lg transition-all duration-300">
        {/* Logo Image with Creative Frame */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          <div className="relative bg-white rounded-full p-1 shadow-lg">
            <img 
              src="/LOGO.png" 
              alt="Pizza Le Duc" 
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
        </div>
        
        {/* Brand Text - Hidden on very small screens, visible on sm+ */}
        <div className="hidden sm:flex flex-col">
          <span className="text-sm md:text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300 tracking-tight">
            Le Duc
          </span>
          <span className="text-xs text-slate-500 group-hover:text-red-600 transition-colors duration-300 font-medium uppercase tracking-wider">
            Pizzeria
          </span>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
      </Link>
    </div>
  );
};

export default Logo;