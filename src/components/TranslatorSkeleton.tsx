import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"

export function TranslatorSkeleton() {
  return (
    <div className="flex flex-col gap-6 mt-8 w-full max-w-3xl mx-auto">
      {[1, 2, 3].map((item) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: item * 0.1 }}
          key={item}
        >
          <Card className="p-6 flex gap-4 items-start">
            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-800 animate-pulse" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-5 bg-slate-800 rounded animate-pulse w-1/3" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded animate-pulse" />
                <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-slate-800 rounded animate-pulse w-4/6" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
