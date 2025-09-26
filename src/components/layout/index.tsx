import { motion } from "framer-motion"
import { toast } from "sonner"

import ProfileModal from "@/components/layout/profile-modal"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "@/components/layout/sidebar/sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    // Função de busca global
    const handleGlobalSearch = (query: string) => {
        toast.info(`Buscando globalmente por: "${query}"`);
        // Aqui você implementaria a lógica de busca global
        // Por exemplo: buscar em agentes, rotinas, usuários, etc.
    }

    return (
        <ThemeProvider>
            <SidebarProvider>
                {/* Header fixo que ocupa toda a largura */}
                <AppHeader 
                    onSearch={handleGlobalSearch}
                    searchPlaceholder="Buscar agentes, rotinas, usuários..."
                />
                
                {/* Container principal com sidebar e conteúdo */}
                <div className="flex h-screen w-full pt-16">
                    {/* Sidebar */}
                    <Sidebar />
                    
                    {/* Conteúdo principal */}
                    <main className="flex-1 w-full">
                        <motion.div
                            className="h-full p-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ScrollArea className="h-full w-full">
                                {children}
                            </ScrollArea>
                        </motion.div>
                    </main>
                </div>
                
                <ProfileModal />
                <Toaster />
            </SidebarProvider>
        </ThemeProvider>
    )
}
