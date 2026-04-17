"use client"

import { motion } from "framer-motion"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
  className?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  className
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className={cn(
        "group p-6 rounded-2xl bg-white border border-coffee-200",
        "hover:border-coffee-300 hover:shadow-lg hover:shadow-coffee-200/40",
        "transition-all duration-300 cursor-default",
        className
      )}
    >
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-coffee-100 mb-4 group-hover:bg-coffee-200 transition-colors duration-300">
        <Icon className="w-5 h-5 text-coffee-700" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-coffee-900 mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-sm text-coffee-600 leading-relaxed">{description}</p>
    </motion.div>
  )
}
