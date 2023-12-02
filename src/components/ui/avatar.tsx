import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"

const avatarVariants = cva(
  "",
  {
    variants: {
      shape: {
        square: "rounded-xl",
        round: "rounded-full"
      }
    },
    defaultVariants: {
      shape: "square"
    }
  },
)

type AvatarVariantProps = VariantProps<typeof avatarVariants>

const Avatar = React.forwardRef <
  React.ElementRef < typeof AvatarPrimitive.Root >,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarVariantProps
> (({className, shape, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden",
        avatarVariants(
          {
            shape,
            className
          }
        )
      )}
      {...props}
    />
    ))
    Avatar.displayName = AvatarPrimitive.Root.displayName

    const AvatarImage = React.forwardRef <
      React.ElementRef < typeof AvatarPrimitive.Image >,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full",
        className
      )}
      {...props}
    />
    ))
    AvatarImage.displayName = AvatarPrimitive.Image.displayName

    const AvatarFallback = React.forwardRef<
      React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted",
        className
      )}
      {...props}
    />
    ))
    AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

    export {Avatar, AvatarImage, AvatarFallback}
