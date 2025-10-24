import { Link, useLocation, useNavigate } from "react-router-dom"
import { ChevronDown, LogOut, Moon, SidebarClose, SidebarOpen, Sun, User, UserCircle2 } from "lucide-react"
import { sidebarItems, type SidebarItem } from "./sidebar-config"
import {
    Sidebar as SidebarPrimitive,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarFooter,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/stores/auth"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { useState, useMemo } from "react"

export function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()
    const { user: currentUser, logout, setProfileModalOpen } = useAuth()
    const { open, toggleSidebar } = useSidebar()
    const [openGroups, setOpenGroups] = useState<string[]>([])

    // Determinar quais grupos devem estar abertos automaticamente baseado na rota atual
    const expandedGroupsForCurrentRoute = useMemo(() => {
        const expanded = new Set<string>()
        sidebarItems.forEach(item => {
            if (item.isGroup && item.children) {
                const hasActiveChild = item.children.some(child => child.href === location.pathname || location.pathname.startsWith(child.href || ""))
                if (hasActiveChild) {
                    expanded.add(item.id)
                }
            }
        })
        return expanded
    }, [location.pathname])

    const isGroupOpen = (groupId: string) => {
        if (expandedGroupsForCurrentRoute.has(groupId)) {
            return true
        }
        return openGroups.includes(groupId)
    }

    const toggleGroup = (groupId: string) => {
        setOpenGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        )
    }

    const isActive = (item: SidebarItem, children?: SidebarItem[]) => {
        if (children) {
            // Valida o exact das children, quando houver
            const hasActiveChild = children.some(child => {
                if (!child.href) return false
                if (child.exact) {
                    return location.pathname === child.href
                }
                return location.pathname.startsWith(child.href)
            })
            return hasActiveChild
        }

        if (!item.href) return false

        if (item.exact) {
            return location.pathname === item.href
        }

        return location.pathname.startsWith(item.href)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const renderSidebarItem = (item: SidebarItem) => {
        let Icon: React.ElementType | null = null
        if (item.icon) {
            Icon = item.icon
        }

        if (item.isGroup && item.children) {
            return (
                <Collapsible key={item.id} open={isGroupOpen(item.id)} onOpenChange={() => toggleGroup(item.id)} className="group/collapsible">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton isActive={isActive(item, item.children)} disabled={item.disabled}>
                                {Icon && <Icon />}
                                <span>{item.title}</span>
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.children.map((child) => (
                                    <SidebarMenuSubItem key={child.id}>
                                        <SidebarMenuSubButton asChild isActive={isActive(child)} disabled={child.disabled}>
                                            <Link to={child.href || "#"}>
                                                {child.icon && <child.icon />}
                                                <span>{child.title}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            )
        }

        if (item.href) {
            return (
                <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={isActive(item)}>
                        <Link to={item.href}>
                            {Icon && <Icon />}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )
        }

        return null
    }

    return (
        <SidebarPrimitive
            collapsible="icon"

            className={cn(
                "select-none transition-all duration-300 ease-in-out pt-16 flex flex-col",
            )}
        >
            {/* Conteudo do Sidebar */}
            <ScrollArea className="h-full overflow-hidden">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {sidebarItems.map(item => renderSidebarItem(item))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </ScrollArea>

            {/* Footer do Sidebar */}
            <SidebarFooter>
                <SidebarContent>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className={cn(
                                "w-full justify-start gap-3 h-12 px-3 rounded-lg",
                                "hover:bg-muted/50 focus-visible:ring-2 focus-visible:none"
                            )}
                            onClick={toggleSidebar}
                        >
                            {open && (
                                <>
                                    <SidebarClose className="w-4 h-4" size={24} />
                                    <span>Fechar</span>
                                </>
                            )}
                            {!open && (
                                <SidebarOpen className="w-4 h-4" size={24} />
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                className={cn(
                                    "w-full justify-start gap-3 h-12 px-3 rounded-lg hover:bg-muted/50",
                                    "focus-visible:ring-2 focus-visible:ring-ring",
                                )}
                            >
                                <UserCircle2 className="w-4 h-4" />

                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, ease: "easeIn" }}
                                >
                                    {open && (
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-md text-foreground truncate">
                                                {currentUser?.name || ''}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {currentUser?.role === 'admin' ? 'Administrador' : 'Usuário'}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            side="right"
                            className="w-56 bg-popover border-border"
                            sideOffset={8}
                        >
                            {/* User Info Header */}
                            <div className="px-3 py-3">
                                <p className="text-md font-semibold text-popover-foreground">
                                    {currentUser?.name || ''}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {currentUser?.role === 'admin' ? 'Administrador' : 'Usuário'}
                                </p>
                            </div>

                            <DropdownMenuSeparator className="bg-border" />

                            {/* Profile Menu Item */}
                            <DropdownMenuItem
                                onClick={() => setProfileModalOpen(true)}
                            >
                                <User className="w-4 h-4 mr-2" />
                                <span>Perfil</span>
                            </DropdownMenuItem>

                            {/* Dark Mode Toggle */}
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    setTheme(theme === 'dark' ? 'light' : 'dark');
                                }}
                            >
                                {theme === 'dark' ? (
                                    <>
                                        <Sun className="w-4 h-4 mr-2" />
                                        <span>Modo Claro</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon className="w-4 h-4 mr-2" />
                                        <span>Modo Escuro</span>
                                    </>
                                )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-border" />

                            {/* Logout Menu Item */}
                            <DropdownMenuItem
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarContent>
            </SidebarFooter>

            <SidebarRail />
        </SidebarPrimitive>
    )
}
