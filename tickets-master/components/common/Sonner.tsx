"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner> & {
  closeOnInteraction?: boolean; // New prop added
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster-custom pl-0"
      toastOptions={{
        classNames: {
          toast: "toast-custom bg-white border-light rounded-8 shadow-4 px-15 py-12 text-15 text-dark",
          description: "toast-description-custom",
          actionButton: "toast-action-button-custom",
          cancelButton: "toast-cancel-button-custom",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
