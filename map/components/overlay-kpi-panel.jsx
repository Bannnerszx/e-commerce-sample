"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function OverlayKpiPanel({ title, icon: TitleIcon, items, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    // Kept a solid, crisp white background with a clean border, and absolutely ZERO shadows
    <div className="bg-white border border-slate-200 rounded-xl mb-3 overflow-hidden shadow-none">
      {/* Panel header - Tightened padding, text color set to dark for high contrast against white bg */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 transition-colors border-b border-transparent data-[state=open]:border-slate-100"
        data-state={open ? "open" : "closed"}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <TitleIcon className="size-3.5 text-slate-700" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-700">
            {title}
          </span>
        </div>
        {open ? (
          <ChevronUp className="size-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="size-3.5 text-slate-400" />
        )}
      </button>

      {/* Items */}
      {open && (
        // Adjusted divider lines to look great against a crisp white background
        <div className="flex flex-col divide-y divide-slate-100 px-4 pb-2">
          {items.map((item, i) => {
            const Icon = item.icon

            // Remapped colors to stand out beautifully on a clean white background
            const valueColor = {
              neutral: "text-slate-900",
              success: "text-emerald-600", // Soft, distinct emerald green
              warning: "text-amber-600",   // Warm amber
              danger: "text-rose-600",
            }[item.status || "neutral"]

            const iconColor = {
              neutral: "text-slate-500",
              success: "text-emerald-500",
              warning: "text-amber-500",
              danger: "text-rose-500",
            }[item.status || "neutral"]

            return (
              // Tightened vertical padding (py-2), zeroed out extra horizontal padding, completely flat
              <div key={i} className="flex items-center gap-3 py-2 transition-colors">
                <Icon className={cn("size-3.5 shrink-0", iconColor)} />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider leading-none">
                    {item.label}
                  </span>
                  {item.subtitle && (
                    <span className="text-[10px] text-slate-400 leading-snug truncate">
                      {item.subtitle}
                    </span>
                  )}
                </div>
                <span className={cn("text-sm font-bold font-mono shrink-0 tabular-nums", valueColor)}>
                  {item.value}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}