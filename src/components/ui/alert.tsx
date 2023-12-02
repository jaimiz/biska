import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        "destructive-outline":
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        destructive:
          "border-destructive/50 bg-red-200 text-destructive dark:border-destructive [&>svg]:text-destructive",
        "success-outline":
          "border-green-500/50 text-green-500 dark:border-green-300 [&>svg]:text-green-500",
        success:
          "border-green-700/50 bg-green-200 text-green-700 dark:border-green-700 [&>svg]:text-green-700",
        "info-outline":
          "border-blue-500/50 text-blue-500 dark:border-blue-300 [&>svg]:text-blue-500",
        info: "border-blue-700/50 bg-blue-200 text-blue-700 dark:border-blue-700 [&>svg]:text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef <
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
    ))
    Alert.displayName = "Alert"

    const AlertTitle = React.forwardRef<
      HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({className, ...props }, ref) => (
      <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
      />
      ))
      AlertTitle.displayName = "AlertTitle"

      const AlertDescription = React.forwardRef<
        HTMLParagraphElement,
      React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props }, ref) => (
        <div
          ref={ref}
          className={cn("text-sm [&_p]:leading-relaxed", className)}
          {...props}
        />
        ))
        AlertDescription.displayName = "AlertDescription"

        export {Alert, AlertTitle, AlertDescription}
