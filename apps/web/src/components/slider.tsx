"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, showValue = true, formatValue, value, min = "0", max = "100", step = "1", ...props }, ref) => {
    const numMin = Number(min)
    const numMax = Number(max)
    
    const [displayValue, setDisplayValue] = React.useState(() => {
      if (value !== undefined && value !== null) {
        const numValue = Number(value)
        // Clamp value between min and max
        return Math.max(numMin, Math.min(numMax, numValue))
      }
      return numMin
    })

    // Sync internal state with prop value
    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        const numValue = Number(value)
        // Clamp value between min and max
        const clampedValue = Math.max(numMin, Math.min(numMax, numValue))
        // Only update if value actually changed to prevent infinite loops
        if (Math.abs(clampedValue - displayValue) > 0.001) {
          setDisplayValue(clampedValue)
        }
      }
    }, [value, numMin, numMax, displayValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseFloat(e.target.value)
      // Clamp value between min and max
      const clampedValue = Math.max(numMin, Math.min(numMax, newValue))
      setDisplayValue(clampedValue)
      // Create a synthetic event with the clamped value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: String(clampedValue),
        },
      } as React.ChangeEvent<HTMLInputElement>
      props.onChange?.(syntheticEvent)
    }

    const formattedValue = formatValue ? formatValue(Number(displayValue)) : displayValue

    return (
      <div className="flex flex-col gap-3">
        {label && (
          <div className="flex justify-between items-center">
            <label className="label" style={{ color: "var(--text-secondary)" }}>
              {label}
            </label>
            {showValue && (
              <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                {formattedValue}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={handleChange}
          className={cn("w-full h-2 rounded-lg appearance-none cursor-pointer", className)}
          style={{
            backgroundColor: "var(--neutral-700)",
            accentColor: "var(--primary)",
          }}
          {...props}
        />
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--primary);
            cursor: pointer;
            box-shadow: var(--shadow-01);
            border: 2px solid var(--primary-400);
            transition: all 120ms;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            background: var(--primary-600);
          }

          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--primary);
            cursor: pointer;
            box-shadow: var(--shadow-01);
            border: 2px solid var(--primary-400);
            transition: all 120ms;
          }

          input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.1);
            background: var(--primary-600);
          }
        `}</style>
      </div>
    )
  },
)

Slider.displayName = "Slider"

export { Slider }
