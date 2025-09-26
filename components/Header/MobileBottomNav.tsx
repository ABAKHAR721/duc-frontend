"use client";

import { cn } from "@/lib/utils";
import { 
  Home, 
  ShoppingCart, 
  Book, 
  MapPin
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientOnly from "../ClientOnly";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NavItems: NavItem[] = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/notre-carte", label: "Notre Carte", icon: ShoppingCart },
  { href: "/notre-histoire", label: "Notre Histoire", icon: Book },
  { href: "/nous-trouver", label: "Nous Trouver", icon: MapPin },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <ClientOnly>
      {/* Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
        <div className="grid grid-cols-4">
          {NavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 text-center",
                  isActive ? "text-red-600" : "text-gray-600 hover:text-red-600"
                )}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </ClientOnly>
  );
}
