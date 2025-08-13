"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";

const tabs = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/category/new", label: "Categories", icon: GridIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/cart", label: "Cart", icon: CartIcon },
  { href: "/account/sign-in", label: "Account", icon: UserIcon },
];

export default function BottomNav() {
  const pathname = usePathname() || "/";
  const { count } = useCart();
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[70] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-t border-black/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5 text-xs">
        {tabs.map((t) => {
          const active = pathname === t.href || (t.href !== "/" && pathname.startsWith(t.href));
          const Icon = t.icon;
          return (
            <li key={t.href} className="flex">
              <Link href={t.href} className="flex-1 py-2.5 flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
                <span className={`h-5 w-5 ${active ? "text-black" : "text-black/60"}`}>
                  <Icon />
                </span>
                <span className={`leading-none ${active ? "text-black" : "text-black/70"}`}>{t.label}</span>
                {t.label === "Cart" && count > 0 && (
                  <span className="absolute top-1.5 right-[18%] h-4 min-w-[1rem] px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3 2.25 10.5h1.5V21h6.75v-6h3v6h6.75V10.5h1.5L12 3Z"/></svg>
  );
}
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z"/></svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.5 3a7.5 7.5 0 1 0 4.354 13.654l4.246 4.246 1.06-1.06-4.246-4.246A7.5 7.5 0 0 0 10.5 3Zm-6 7.5a6 6 0 1 1 12.002 0 6 6 0 0 1-12.001 0Z"/></svg>
  );
}
function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 3.75h2.4l.96 4.8 1.14 5.7A3 3 0 0 0 9.69 17.25h6.87a3 3 0 0 0 2.94-2.37l1.5-7.38H6.09l-.6-3H2.25ZM9 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.25a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/><path fillRule="evenodd" d="M4.5 20.25a7.5 7.5 0 1 1 15 0 .75.75 0 0 1-1.5 0 6 6 0 1 0-12 0 .75.75 0 0 1-1.5 0Z" clipRule="evenodd"/></svg>
  );
}
