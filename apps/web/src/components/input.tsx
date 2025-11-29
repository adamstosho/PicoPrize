"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: React.ReactNode
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, label, id, type = "text", ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="label" style={{ color: "var(--text-secondary)" }}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div
              className="absolute left-3 flex items-center pointer-events-none"
              style={{ color: "var(--text-secondary)" }}
            >
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "h-11 w-full rounded-md px-4 py-2 transition-colors focus:outline-none focus:ring-3 disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              className,
            )}
            style={{
              backgroundColor: "var(--surface-01)",
              borderColor: error ? "var(--danger)" : "var(--border)",
              color: "var(--text-primary)",
              borderWidth: "1px",
              ...(error && { outlineColor: "var(--danger)" }),
            }}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm flex items-center gap-1" style={{ color: "var(--danger)" }}>
            <span>⚠</span>
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }
