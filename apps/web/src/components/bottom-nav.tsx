"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/lessons", label: "Lessons", icon: "📚" },
    { href: "/leaderboard", label: "Board", icon: "🏆" },
    { href: "/wallet", label: "Wallet", icon: "💰" },
    { href: "/creator", label: "Create", icon: "✏️" },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t md:hidden z-50"
      style={{
        backgroundColor: "var(--surface-01)",
        borderTopColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center h-16 flex-1 transition-colors"
              style={{
                color: isActive ? "var(--primary)" : "var(--text-secondary)",
                backgroundColor: isActive ? "rgba(108, 99, 255, 0.1)" : "transparent",
              }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
