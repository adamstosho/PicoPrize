"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-[var(--surface)] border border-[var(--border)]",
    glass: "bg-[var(--glass-01)] backdrop-blur-xl border border-[var(--border)]",
    elevated: "bg-[var(--surface)] border border-[var(--border)] shadow-[0_6px_18px_rgba(7,12,24,0.45)]",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-5 transition-all duration-200",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
})

Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-0 mb-4", className)} {...props} />
  ),
)

CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      style={{ color: "var(--text-primary)" }}
      className={cn("text-xl font-semibold", className)}
      {...props}
    />
  ),
)

CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} style={{ color: "var(--text-secondary)" }} className={cn("text-sm", className)} {...props} />
  ),
)

CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-0", className)} {...props} />,
)

CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between pt-4 mt-4 border-t", className)}
      style={{ borderTopColor: "var(--border)" }}
      {...props}
    />
  ),
)

CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
