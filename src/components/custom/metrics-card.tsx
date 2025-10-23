import type { LucideIcon } from "lucide-react";
import { HelpCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface MetricsCardProps {
  /** Ícone do card */
  icon: LucideIcon;
  /** Título do card */
  title: string;
  /** Valor principal a ser exibido */
  value: string | number;
  /** Texto de comparação (ex: "vs. mês anterior") */
  comparisonText?: string;
  /** Valor da variação percentual */
  percentageChange?: number;
  /** Cor do ícone */
  iconColor?: React.HTMLAttributes<HTMLDivElement>['className'];
  /** Indicador de carregamento */
  loading?: boolean;
  /** Informações detalhadas para o tooltip */
  tooltipContent?: string;
  /** Classe CSS adicional */
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

export function MetricsCard({
  icon: Icon,
  title,
  value,
  comparisonText,
  percentageChange,
  iconColor = "text-muted-foreground",
  loading = false,
  tooltipContent,
  className
}: MetricsCardProps) {
  const isPositive = percentageChange && percentageChange > 0;
  const isNegative = percentageChange && percentageChange < 0;

  return (
    <TooltipProvider>
      <Card className={cn("relative overflow-hidden", className)}>
        <CardContent>
          <div className="flex items-start justify-between gap-2">
            {/* Conteúdo principal: Ícone, título, valor e comparação */}
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <div className={cn("p-1.5 rounded-lg bg-muted/50 shrink-0", iconColor)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-0.5 break-words">
                  {title}
                </p>
                {loading ? (
                  <div className="text-xl font-bold text-foreground mb-1 break-words">
                    <Skeleton className="h-6 w-24" />
                  </div>
                ) : (
                  <div className="text-xl font-bold text-foreground mb-1 break-words">
                    {value}
                  </div>
                )}

                {/* Badge de variação e texto de comparação embaixo do valor */}
                {(percentageChange !== undefined || comparisonText) && (
                  <div className="flex flex-wrap items-center gap-1">
                    {percentageChange !== undefined && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 shrink-0",
                          isPositive && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                          isNegative && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        )}
                      >
                        {isPositive && "+"}
                        {percentageChange}%
                      </Badge>
                    )}
                    {comparisonText && (
                      <span
                        className="text-[10px] text-muted-foreground break-all overflow-wrap-anywhere"
                        style={{
                          wordBreak: 'break-all',
                          overflowWrap: 'anywhere',
                          hyphens: 'auto'
                        }}
                      >
                        {comparisonText}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Ícone de informação com tooltip */}
            {tooltipContent && (
              <div className="shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="opacity-60 hover:opacity-100 transition-opacity justify-center items-center">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
