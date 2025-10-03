import React from "react";
import {
    type ColumnDef,
    flexRender,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTablePagination, DataTableToolbar } from "./components";

interface DataTableProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    showPagination?: boolean;
    showToolbar?: boolean;
    showSorting?: boolean;
    showFiltering?: boolean;
    initialPageSize?: number;
    pageSizeOptions?: number[];
    toolbarPlaceholder?: string;
    enableColumnVisibility?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    showPagination = true,
    showToolbar = true,
    showSorting = true,
    showFiltering = true,
    initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 30, 40, 50],
    toolbarPlaceholder = "Filtrar registros...",
    enableColumnVisibility = true,
    className,
    isLoading,
    ...props
}: DataTableProps<TData, TValue>) {
    const {
        table,
        globalFilter,
        setGlobalFilter,
        resetAll,
    } = useDataTable({
        data,
        columns,
        initialPageSize,
        enableSorting: showSorting,
        enableFiltering: showFiltering,
        enableColumnVisibility,
    });

    return (
        <div className="space-y-4">
            {showToolbar && (
                <DataTableToolbar
                    table={table}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    placeholder={toolbarPlaceholder}
                    onReset={resetAll}
                />
            )}
            
            <div className={cn("overflow-hidden border rounded-md", className)} {...props}>
                <Table className="w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : header.column.getCanSort() ? (
                                                <Button
                                                    variant="ghost"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className="h-auto p-0 font-semibold hover:bg-transparent"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                                                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                                                    }[header.column.getIsSorted() as string] ?? (
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    )}
                                                </Button>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            )}
                                    </TableHead>
                                )
                                )}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {!isLoading && table.getRowModel().rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <span>Nenhum dado disponível</span>
                                </TableCell>
                            </TableRow>
                        )}

                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Carregando...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {showPagination && !isLoading && (
                <DataTablePagination
                    table={table}
                    showPageSizeSelector={true}
                    pageSizeOptions={pageSizeOptions}
                />
            )}
        </div>
    )
}
