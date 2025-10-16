import { useState } from "react";
import { Users, TrendingUp, Calendar, Target, Languages, UserCheck, MessageSquare, Zap, Eye, Edit, Trash2, Filter } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MetricsCard, ProgressCard } from "@/components/custom";
import { DataTable, FilterFields } from "@/components/data-table";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<"hoje" | "7d" | "30d">("hoje")

    // Estados para demonstração da DataTable com filtros
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)
    const [filters, setFilters] = useState({
        name: "",
        department: "all",
        status: "all"
    })
    const [isLoadingTable, setIsLoadingTable] = useState(false)

    // Funções para manipular filtros
    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters)
        setIsLoadingTable(true)
        // Simular carregamento
        setTimeout(() => {
            setIsLoadingTable(false)
        }, 1000)
    }

    const toggleFiltersExpanded = () => {
        setIsFiltersExpanded(!isFiltersExpanded)
    }

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

    // Dados mockados para a tabela de exemplo
    const tableData = [
        {
            id: "1",
            name: "João Silva",
            email: "joao.silva@empresa.com",
            department: "Vendas",
            status: "active",
            lastLogin: "2024-01-20T10:30:00Z",
            performance: 95,
        },
        {
            id: "2",
            name: "Maria Santos",
            email: "maria.santos@empresa.com",
            department: "Marketing",
            status: "active",
            lastLogin: "2024-01-19T14:15:00Z",
            performance: 87,
        },
        {
            id: "3",
            name: "Pedro Oliveira",
            email: "pedro.oliveira@empresa.com",
            department: "Desenvolvimento",
            status: "inactive",
            lastLogin: "2024-01-15T09:45:00Z",
            performance: 92,
        },
        {
            id: "4",
            name: "Ana Costa",
            email: "ana.costa@empresa.com",
            department: "RH",
            status: "active",
            lastLogin: "2024-01-20T16:20:00Z",
            performance: 78,
        },
        {
            id: "5",
            name: "Carlos Ferreira",
            email: "carlos.ferreira@empresa.com",
            department: "Financeiro",
            status: "active",
            lastLogin: "2024-01-18T11:10:00Z",
            performance: 89,
        },
        {
            id: "6",
            name: "Lucia Rodrigues",
            email: "lucia.rodrigues@empresa.com",
            department: "Vendas",
            status: "inactive",
            lastLogin: "2024-01-12T13:30:00Z",
            performance: 91,
        },
        {
            id: "7",
            name: "Roberto Alves",
            email: "roberto.alves@empresa.com",
            department: "Marketing",
            status: "active",
            lastLogin: "2024-01-20T08:45:00Z",
            performance: 83,
        },
        {
            id: "8",
            name: "Fernanda Lima",
            email: "fernanda.lima@empresa.com",
            department: "Desenvolvimento",
            status: "active",
            lastLogin: "2024-01-19T15:25:00Z",
            performance: 96,
        },
        {
            id: "9",
            name: "Marcos Souza",
            email: "marcos.souza@empresa.com",
            department: "RH",
            status: "inactive",
            lastLogin: "2024-01-14T12:00:00Z",
            performance: 74,
        },
        {
            id: "10",
            name: "Patricia Gomes",
            email: "patricia.gomes@empresa.com",
            department: "Financeiro",
            status: "active",
            lastLogin: "2024-01-20T17:15:00Z",
            performance: 88,
        },
        {
            id: "11",
            name: "Rafael Mendes",
            email: "rafael.mendes@empresa.com",
            department: "Vendas",
            status: "active",
            lastLogin: "2024-01-19T09:30:00Z",
            performance: 93,
        },
        {
            id: "12",
            name: "Juliana Rocha",
            email: "juliana.rocha@empresa.com",
            department: "Marketing",
            status: "active",
            lastLogin: "2024-01-20T14:45:00Z",
            performance: 85,
        },
    ];

    // Definição das colunas da tabela
    const tableColumns: ColumnDef<typeof tableData[0]>[] = [
        {
            accessorKey: "name",
            header: "Nome",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "department",
            header: "Departamento",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge variant={status === "active" ? "default" : "secondary"}>
                        {status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "lastLogin",
            header: "Último Acesso",
            cell: ({ row }) => {
                const date = new Date(row.getValue("lastLogin"));
                return date.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            },
        },
        {
            accessorKey: "performance",
            header: "Performance",
            cell: ({ row }) => {
                const performance = row.getValue("performance") as number;
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                                className={cn(
                                    "h-2 rounded-full",
                                    performance >= 90 ? "bg-green-500" :
                                        performance >= 80 ? "bg-yellow-500" : "bg-red-500"
                                )}
                                style={{ width: `${performance}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium">{performance}%</span>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => console.log("View", row.original.id)}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Visualizar</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => console.log("Edit", row.original.id)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Editar</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => console.log("Delete", row.original.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Excluir</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

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


                {/* Nova seção demonstrando DataTable com filtros */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Usuários com Filtros Avançados</h3>
                            <p className="text-sm text-muted-foreground">
                                Demonstração completa da DataTable com componentes de filtro
                            </p>
                        </div>
                        <Button onClick={toggleFiltersExpanded}>
                            <Filter className="h-4 w-4 mr-2" />
                            Filtros
                        </Button>
                    </div>

                    {/* Campos de filtro */}
                    <FilterFields
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        isExpanded={isFiltersExpanded}
                        isLoading={isLoadingTable}
                        filterFields={
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome</label>
                                    <Input
                                        placeholder="Filtrar por nome..."
                                        value={filters.name}
                                        onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Departamento</label>
                                    <Select
                                        value={filters.department}
                                        onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione o departamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="Vendas">Vendas</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                                            <SelectItem value="RH">RH</SelectItem>
                                            <SelectItem value="Financeiro">Financeiro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select
                                        value={filters.status}
                                        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="active">Ativo</SelectItem>
                                            <SelectItem value="inactive">Inativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        }
                    />

                    {/* DataTable com filtros aplicados */}
                    <DataTable
                        columns={tableColumns}
                        data={tableData.filter(item => {
                            const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase())
                            const matchesDepartment = !filters.department || filters.department === "all" || item.department === filters.department
                            const matchesStatus = !filters.status || filters.status === "all" || item.status === filters.status
                            return matchesName && matchesDepartment && matchesStatus
                        })}
                        isLoading={isLoadingTable}
                        showPagination={true}
                    />
                </div>
            </div>
        </PageContainer>
    )
}
