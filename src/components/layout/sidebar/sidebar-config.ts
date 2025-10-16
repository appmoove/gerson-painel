// import { LayoutDashboard, AlarmClock, Bot, Users, ShieldUser } from "lucide-react"
import {
    AlarmClock,
    BadgeDollarSign,
    Bell,
    Bot,
    Building,
    Cable,
    Calendar,
    ChartCandlestick,
    Coins,
    DollarSign,
    HandCoins,
    Handshake,
    KeyRound,
    LayoutDashboard,
    Link,
    Settings,
    Shield,
    ShieldUser,
    Speech,
    SquaresExclude,
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
        icon: SquaresExclude,
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
                icon: ChartCandlestick,
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
        icon: BadgeDollarSign,
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
        icon: Handshake,
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
        icon: HandCoins,
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
                icon: DollarSign,
                href: "/faturamento",
                exact: true
            }
        ]
    },
    {
        id: "integracoes",
        title: "Integrações",
        icon: Cable,
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
        icon: Settings,
        isGroup: true,
        children: [
            {
                id: "vozes",
                title: "Vozes",
                icon: Speech,
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
