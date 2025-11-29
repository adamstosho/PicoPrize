"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, icon, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-3 disabled:opacity-50 disabled:cursor-not-allowed btn-press"

    const variants = {
      primary: "bg-[var(--primary)] hover:bg-[var(--primary-600)] focus:ring-[var(--primary-400)] active:bg-[var(--primary-600)] text-white shadow-lg",
      secondary:
        "border-2 border-[var(--border)] hover:border-[var(--border-light)] text-[var(--text-primary)] focus:ring-[var(--primary-400)] hover:bg-[var(--surface-02)]",
      ghost: "text-[var(--text-primary)] hover:bg-[var(--surface-01)] focus:ring-[var(--primary-400)]",
      danger: "bg-[var(--danger)] hover:bg-red-600 focus:ring-red-400 active:bg-red-600 text-white shadow-lg",
    }

    const sizes = {
      sm: "h-9 px-3 text-sm gap-2",
      md: "h-11 px-4 text-base gap-2",
      lg: "h-12 px-6 text-lg gap-3",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !isLoading && icon}
        <span>{children}</span>
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button }
