import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  /** Ícone do card */
  icon: LucideIcon;
  /** Título do card */
  title: string;
  /** Valor atual */
  current: number;
  /** Valor máximo */
  max: number;
  /** Texto de progresso (ex: "48% usado") */
  progressText: string;
  /** Cor do ícone */
  iconColor?: string;
  /** Cor da barra de progresso */
  progressColor?: string;
  /** Classe CSS adicional */
  className?: string;
}

export function ProgressCard({
  icon: Icon,
  title,
  current,
  max,
  progressText,
  iconColor = "text-muted-foreground",
  progressColor = "bg-blue-500",
  className
}: ProgressCardProps) {
  const percentage = Math.round((current / max) * 100);

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Ícone e título */}
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-lg bg-muted/50", iconColor)}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs font-medium text-muted-foreground break-words">
              {title}
            </p>
          </div>
        </div>

        {/* Valor principal */}
        <div className="mb-2">
          <div className="text-xl font-bold text-foreground">
            {current}/{max}
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn("h-2 rounded-full transition-all duration-300", progressColor)}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* Texto de progresso */}
          <p className="text-[10px] text-muted-foreground">
            {progressText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
