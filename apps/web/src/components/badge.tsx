"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "accent"
  size?: "sm" | "md"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => {
    const getVariantStyle = () => {
      switch (variant) {
        case "success":
          return { backgroundColor: "rgba(0, 210, 138, 0.2)", color: "var(--success)" }
        case "warning":
          return { backgroundColor: "rgba(255, 176, 32, 0.2)", color: "var(--warning)" }
        case "danger":
          return { backgroundColor: "rgba(255, 90, 110, 0.2)", color: "var(--danger)" }
        case "accent":
          return { backgroundColor: "rgba(0, 209, 178, 0.2)", color: "var(--accent)" }
        default:
          return { backgroundColor: "var(--neutral-700)", color: "var(--text-secondary)" }
      }
    }

    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
    }

    return (
      <div
        ref={ref}
        style={getVariantStyle()}
        className={cn("inline-flex items-center rounded-full font-medium", sizes[size], className)}
        {...props}
      />
    )
  },
)

Badge.displayName = "Badge"

export { Badge }
