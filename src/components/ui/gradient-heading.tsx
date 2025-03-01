
import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
  "tracking-tight pb-3 bg-clip-text text-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-t from-neutral-700 to-neutral-800 dark:from-stone-200 dark:to-neutral-200",
        pink: "bg-gradient-to-t from-accent to-accent/90 dark:from-stone-200 dark:to-neutral-200",
        light: "bg-gradient-to-t from-neutral-200 to-neutral-300",
        secondary:
          "bg-gradient-to-t from-neutral-500 to-neutral-600 dark:from-stone-200 dark:to-neutral-200",
        resume: "bg-gradient-to-t from-indigo-700 to-indigo-500 dark:from-indigo-300 dark:to-indigo-100",
      },
      size: {
        default: "text-2xl sm:text-3xl lg:text-4xl",
        xxs: "text-base sm:text-lg lg:text-lg",
        xs: "text-lg sm:text-xl lg:text-2xl",
        sm: "text-xl sm:text-2xl lg:text-3xl",
        md: "text-2xl sm:text-3xl lg:text-4xl",
        lg: "text-3xl sm:text-4xl lg:text-5xl",
        xl: "text-4xl sm:text-5xl lg:text-6xl",
        xll: "text-5xl sm:text-6xl lg:text-[5.4rem]  lg:leading-[0.5rem] ",
        xxl: "text-5xl sm:text-6xl lg:text-[6rem]",
        xxxl: "text-5xl sm:text-6xl lg:text-[8rem]",
        // New dynamic sizes for resumes
        dynamic: "text-[clamp(1rem,5vw,2rem)]",
        dynamicLg: "text-[clamp(1.2rem,6vw,2.5rem)]",
        dynamicSm: "text-[clamp(0.8rem,4vw,1.5rem)]",
      },
      weight: {
        default: "font-bold",
        thin: "font-thin",
        base: "font-base",
        semi: "font-semibold",
        bold: "font-bold",
        black: "font-black",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "default",
    },
  }
)

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

const GradientHeading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ asChild, variant, weight, size, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "h3"
    return (
      <Comp ref={ref} {...props} className={className}>
        <span className={cn(headingVariants({ variant, size, weight }))}>
          {children}
        </span>
      </Comp>
    )
  }
)

GradientHeading.displayName = "GradientHeading"

export type Variant = "default" | "pink" | "light" | "secondary" | "resume"
export type Size = "default" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "dynamic" | "dynamicLg" | "dynamicSm"
export type Weight = "default" | "thin" | "base" | "semi" | "bold" | "black"

export { GradientHeading, headingVariants }
