import { motion } from "framer-motion"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const footerVariants = cva(
    "fixed bottom-0 right-0 py-4 z-5 transition-all duration-200",
    {
        variants: {
            variant: {
                default: "bg-background border-t border-border",
                destructive: "bg-destructive border-t border-destructive",
                ghost: "bg-transparent",
                glass: "bg-background/70 backdrop-blur border-t border-border/50 supports-[backdrop-filter]:bg-background/60",
            },
            size: {
                default: "h-16",
                small: "h-12",
                large: "h-20",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

interface PageActionFooterProps {
    children: React.ReactNode
    variant?: "default" | "destructive" | "ghost" | "glass"
    size?: "default" | "small" | "large"
}

export const PageActionFooter = ({
    children,
    variant = "default",
    size = "default"
}: PageActionFooterProps) => {
    const { open, isMobile } = useSidebar()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                footerVariants({ variant, size }),
                open ? "left-64" : isMobile ? "left-0" : "left-16"
            )}
        >
            {/* Container que respeita o mesmo padding do PageContainer */}
            <div className="flex items-center justify-end gap-2 w-full h-full mx-auto" style={{ maxWidth: '80rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                {children}
            </div>
        </motion.div>
    )
}
