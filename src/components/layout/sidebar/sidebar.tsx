import { Link, useLocation, useNavigate } from "react-router-dom"
import { ChevronDown, LogOut, Moon, Sun, User, PanelLeftClose, PanelLeftOpen } from "lucide-react"
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
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/stores/auth"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle"

export function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()
    const { user: currentUser, logout, setProfileModalOpen } = useAuth()
    const { isCollapsed, toggleSidebar } = useSidebarToggle()

    const isActive = (item: SidebarItem) => {
        if (!item.href) return false

        if (item.exact) {
            return location.pathname === item.href
        }

        return location.pathname.startsWith(item.href)
    }

    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
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
            if (isCollapsed) {
                return null
            }

            return (
                <Collapsible key={item.id} defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                                {Icon && <Icon />}
                                <span>{item.title}</span>
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.children.map((child) => (
                                    <SidebarMenuSubItem key={child.id}>
                                        <SidebarMenuSubButton asChild>
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
                        <Link to={item.href} className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50",
                            isCollapsed ? "justify-center" : "justify-start"
                        )}>
                            {Icon && <Icon />}
                            {!isCollapsed && <span>{item.title}</span>}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )
        }

        return null
    }

    return (
        <>
            <SidebarPrimitive
                className={cn(
                    "select-none transition-all duration-300 ease-in-out pt-16 flex flex-col h-screen",
                    isCollapsed ? "w-16" : "w-64"
                )}
            >


                {/* Conteudo do Sidebar */}
                <div className="flex-1 overflow-hidden">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {sidebarItems.map(item => renderSidebarItem(item))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </div>

                <div className="flex items-center justify-center px-2 py-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className="h-8 px-3 gap-2 hover:bg-muted"
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="h-4 w-4" />
                        ) : (
                            <>
                                <PanelLeftClose className="h-4 w-4" />
                                <span className="text-xs">Recolher</span>
                            </>
                        )}
                        <span className="sr-only">
                            {isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
                        </span>
                    </Button>
                </div>

                {/* Footer do Sidebar */}
                <SidebarFooter className="border-t border-border w-full flex-shrink-0">
                    <SidebarContent>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    className={cn(
                                        "w-full justify-start gap-3 h-12 px-3 rounded-lg hover:bg-muted/50",
                                        "focus-visible:ring-2 focus-visible:ring-ring",
                                    )}
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={currentUser?.avatar || ''} />
                                        <AvatarFallback className="text-white gradient-primary font-medium">
                                            {getUserInitials(currentUser?.name || '')}
                                        </AvatarFallback>
                                    </Avatar>

                                    {!isCollapsed && (
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-md text-foreground truncate">
                                                {currentUser?.name || ''}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {currentUser?.role === 'admin' ? 'Administrador' : 'Usuário'}
                                            </p>
                                        </div>
                                    )}
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
            </SidebarPrimitive>
        </>
    )
}
