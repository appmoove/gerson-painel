import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface BasicTooltipProps {
    /** Conteúdo a ser exibido no tooltip */
    content: React.ReactNode;
    /** Elemento que acionará o tooltip */
    children: React.ReactNode;
}
export const BasicTooltip = ({ content, children }: BasicTooltipProps) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                {content}
            </TooltipContent>
        </Tooltip>
    )
}
