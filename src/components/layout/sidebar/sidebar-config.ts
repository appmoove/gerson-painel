// import { LayoutDashboard, AlarmClock, Bot, Users, ShieldUser } from "lucide-react"
import {
    AlarmClock,
    AudioLines,
    BarChart,
    Bell,
    Bot,
    Building,
    Calendar,
    Coins,
    HandCoins,
    KeyRound,
    LayoutDashboard,
    Link,
    Shield,
    ShieldUser,
    Users2,
    UserStar,
    Webhook,
 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface SidebarItem {
    id: string
    title: string
    icon?: LucideIcon
    href?: string
    isGroup?: boolean
    children?: SidebarItem[]
    exact?: boolean
}

export const sidebarItems: SidebarItem[] = [
    {
        id: "principal",
        title: "Principal",
        isGroup: true,
        children: [
            {
                id: "dashboard",
                title: "Dashboard",
                icon: LayoutDashboard,
                href: "/",
                exact: true
            },
            {
                id: "analiticas",
                title: "Analíticas",
                icon: BarChart,
                href: "/analitics",
                exact: true
            },
            {
                id: "notificacoes",
                title: "Notificações",
                icon: Bell,
                href: "/notifications",
                exact: true
            },
        ]
    },
    {
        id: "vendas",
        title: "Vendas",
        isGroup: true,
        children: [
            {
                id: "leads",
                title: "Leads",
                icon: UserStar,
                href: "/leads",
                exact: true
            },
            {
                id: "agentes",
                title: "Agentes",
                icon: Bot,
                href: "/agentes",
                exact: true
            },
            {
                id: "rotinas",
                title: "Rotinas",
                icon: AlarmClock,
                href: "/rotinas",
                exact: true
            },
            {
                id: "agenda",
                title: "Agenda",
                icon: Calendar,
                href: "/agenda",
                exact: true
            }
        ],
    },
    {
        id: "gestao",
        title: "Gestão",
        isGroup: true,
        children: [
            {
                id: "usuarios",
                title: "Usuários",
                icon: Users2,
                href: "/usuarios",
                exact: true
            },
            {
                id: "permissoes",
                title: "Permissões",
                icon: ShieldUser,
                href: "/permissoes",
                exact: true
            },
            {
                id: "organizacao",
                title: "Organização",
                icon: Building,
                href: "/organizacao",
                exact: true
            }
        ]
    },
    {
        id: "financeiro",
        title: "Financeiro",
        isGroup: true,
        children: [
            {
                id: "creditos",
                title: "Créditos",
                icon: Coins,
                href: "/creditos",
                exact: true
            },
            {
                id: "faturamento",
                title: "Faturamento",
                icon: HandCoins,
                href: "/faturamento",
                exact: true
            }
        ]
    },
    {
        id: "integracoes",
        title: "Integrações",
        isGroup: true,
        children: [
            {
                id: "integracoes",
                title: "Integrações",
                icon: Link,
                href: "/integracoes",
                exact: true
            },
            {
                id: "webhooks",
                title: "Webhooks",
                icon: Webhook,
                href: "/webhooks",
                exact: true
            },
            {
                id: "api",
                title: "API Keys",
                icon: KeyRound,
                href: "/api-keys",
                exact: true
            },
        ]
    },
    {
        id: "sistema",
        title: "Sistema",
        isGroup: true,
        children: [
            {
                id: "vozes",
                title: "Vozes",
                icon: AudioLines,
                href: "/vozes",
                exact: true
            },
            {
                id: "seguranca",
                title: "Segurança",
                icon: Shield,
                href: "/seguranca",
                exact: true
            }
        ]
    }
]
