import { useState } from "react";
import { Users, TrendingUp, Calendar, Target, Languages, UserCheck, MessageSquare, Zap, CreditCard } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MetricsCard, ProgressCard } from "@/components/custom";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<"hoje" | "7d" | "30d">("hoje")

    //apenas testes :)
    // Dados mockados para os cards de métricas
    const metricsData = [
        {
            icon: Users,
            title: "Nooooooossa",
            value: "327",
            percentageChange: 12.4,
            comparisonText: "Nossaaa",
            iconColor: "text-blue-600",
            tooltipContent: "Número total de novos leads captados nos últimos 30 dias através de todos os canais de aquisição (site, redes sociais, campanhas pagas, etc.)"
        },
       
        {
            icon: TrendingUp,
            title: "Taxa de conversão",
            value: "24.8%",
            percentageChange: 5.2,
            comparisonText: "vs. período anterior",
            iconColor: "text-green-600",
            tooltipContent: "Porcentagem de leads que se tornaram clientes após a conversão (conversão de leads em vendas)"
        },
        {
            icon: Calendar,
            title: "Reuniões agendadas",
            value: "156",
            percentageChange: -2.1,
            comparisonText: "vs. semana anterior",
            iconColor: "text-purple-600",
            tooltipContent: "Número total de reuniões agendadas com clientes nos últimos 7 dias"
        },
        {
            icon: Target,
            title: "Meta do mês",
            value: "78%",
            percentageChange: 8.7,
            comparisonText: "do objetivo",
            iconColor: "text-orange-600",
            tooltipContent: "Porcentagem de atingimento da meta de vendas para o mês atual"
        },
        {
            icon: Languages,
            title: "Xing Xong Xin",
            value: "1000%",
            percentageChange: 89.7,
            comparisonText: "so xina carai",
            iconColor: "text-pink-600",
            tooltipContent: "Fia da puta poque nao trabaia"

        }
    ]

    // Dados mockados para os cards de progresso
    const progressData = [
        {
            icon: UserCheck,
            title: "Usuários",
            current: 25,
            max: 25,
            progressText: "100% usado",
            iconColor: "text-blue-600",
            progressColor: "bg-blue-500"
        },
        {
            icon: MessageSquare,
            title: "Contatos",
            current: 7420,
            max: 10000,
            progressText: "74% usado",
            iconColor: "text-green-600",
            progressColor: "bg-green-500"
        },
        {
            icon: Zap,
            title: "Agentes IA",
            current: 5,
            max: 8,
            progressText: "63% usado",
            iconColor: "text-yellow-600",
            progressColor: "bg-yellow-500"
        }
    ]

    const periodButtons = [
        { key: 'hoje', label: 'Hoje' },
        { key: '7d', label: '7 dias' },
        { key: '30d', label: '30 dias' }
    ] as const

    const headerActions = (
        <div className="flex items-center gap-2">
            {periodButtons.map(period => (
                <Button
                    key={period.key}
                    variant="ghost"
                    onClick={() => setSelectedPeriod(period.key as "hoje" | "7d" | "30d")}
                    className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium cursor-pointer border border-input",
                        selectedPeriod === period.key
                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/80"
                            : "bg-transparent text-muted-foreground border-input hover:bg-primary/8 hover:text-foreground hover:border-primary/40"
                    )}
                >
                    {period.label}
                </Button>
            ))}
        </div>
    )

    return (
        
        <PageContainer
            title="Dashboard"
            subtitle="Visão geral do desempenho do sistema"
            breadcrumbs={[
                { label: "Dashboard", to: "/" },
            ]}
            extra={headerActions}
        >
            <div className="space-y-6">
                {/* cardzinhos de métricas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metricsData.map((metric, index) => (
                        <MetricsCard
                            key={index}
                            icon={metric.icon}
                            title={metric.title}
                            value={metric.value}
                            percentageChange={metric.percentageChange}
                            comparisonText={metric.comparisonText}
                            iconColor={metric.iconColor}
                            tooltipContent={metric.tooltipContent}
                        />
                    ))}
                </div>

                {/* cardzinhos de progresso */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {progressData.map((progress, index) => (
                        <ProgressCard
                            key={index}
                            icon={progress.icon}
                            title={progress.title}
                            current={progress.current}
                            max={progress.max}
                            progressText={progress.progressText}
                            iconColor={progress.iconColor}
                            progressColor={progress.progressColor}
                        />
                    ))}
                </div>

                
            </div>
        </PageContainer>
    )
}
