import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MainContent({ children }: { children: React.ReactNode }) {
    const { open, isMobile } = useSidebar()

    return (
        <motion.main
            className={cn("flex-1 w-full transition-all duration-200", open ? "pl-64" : isMobile ? "pl-0" : "pl-16")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="h-full py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
        </motion.main>
    )
}
