import React from "react";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface DataTablePaginationProps {
    table: any;
    showPageSizeSelector?: boolean;
    pageSizeOptions?: number[];
}

export function DataTablePagination({
    table,
    showPageSizeSelector = true,
    pageSizeOptions = [5, 10, 20, 30, 40, 50],
}: DataTablePaginationProps) {
    const totalRows = table.getFilteredRowModel().rows.length;
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;

    return (
        <>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">
                        {totalRows} registro{totalRows !== 1 ? "s" : ""} total{totalRows !== 1 ? "is" : ""}
                    </p>
                    {showPageSizeSelector && (
                        <>
                            <p className="text-sm text-muted-foreground">por página</p>
                            <Select
                                value={`${pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {pageSizeOptions.map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                            Página {currentPage} de {totalPages}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir para primeira página</span>
                            <ChevronsLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir para página anterior</span>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir para próxima página</span>
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir para última página</span>
                            <ChevronsRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <Separator />
        </>
    );
}

interface DataTableToolbarProps {
    table: any;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    placeholder?: string;
    showResetButton?: boolean;
    onReset?: () => void;
}

export function DataTableToolbar({
    table,
    globalFilter,
    setGlobalFilter,
    placeholder = "Filtrar registros...",
    showResetButton = true,
    onReset,
}: DataTableToolbarProps) {
    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter !== "";

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={placeholder}
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(String(event.target.value))}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {isFiltered && showResetButton && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters();
                            setGlobalFilter("");
                            onReset?.();
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Resetar
                    </Button>
                )}
            </div>
        </div>
    );
}
