import { useState } from "react";
import {
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    type PaginationState,
} from "@tanstack/react-table";

interface UseDataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    initialPageSize?: number;
    enableSorting?: boolean;
    enableFiltering?: boolean;
    enableColumnVisibility?: boolean;
}

interface UseDataTableReturn<TData> {
    table: ReturnType<typeof useReactTable<TData>>;
    sorting: SortingState;
    setSorting: (sorting: SortingState) => void;
    columnFilters: ColumnFiltersState;
    setColumnFilters: (filters: ColumnFiltersState) => void;
    globalFilter: string;
    setGlobalFilter: (filter: string) => void;
    columnVisibility: VisibilityState;
    setColumnVisibility: (visibility: VisibilityState) => void;
    pagination: PaginationState;
    setPagination: (pagination: PaginationState) => void;
    resetFilters: () => void;
    resetSorting: () => void;
    resetPagination: () => void;
    resetAll: () => void;
}

export function useDataTable<TData>({
    data,
    columns,
    initialPageSize = 10,
    enableSorting = true,
    enableFiltering = true,
    enableColumnVisibility = true,
}: UseDataTableProps<TData>): UseDataTableReturn<TData> {
    // Estados para sorting
    const [sorting, setSorting] = useState<SortingState>([]);

    // Estados para filtros
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Estados para visibilidade das colunas
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    // Estados para paginação
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });

    // Configuração da tabela
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting: enableSorting ? sorting : undefined,
            columnFilters: enableFiltering ? columnFilters : undefined,
            globalFilter: enableFiltering ? globalFilter : undefined,
            columnVisibility: enableColumnVisibility ? columnVisibility : undefined,
            pagination,
        },
        enableSorting,
        enableFilters: enableFiltering,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
        globalFilterFn: "includesString",
    });

    // Funções de reset
    const resetFilters = () => {
        setColumnFilters([]);
        setGlobalFilter("");
    };

    const resetSorting = () => {
        setSorting([]);
    };

    const resetPagination = () => {
        setPagination({
            pageIndex: 0,
            pageSize: initialPageSize,
        });
    };

    const resetAll = () => {
        resetFilters();
        resetSorting();
        resetPagination();
        setColumnVisibility({});
    };

    return {
        table,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        globalFilter,
        setGlobalFilter,
        columnVisibility,
        setColumnVisibility,
        pagination,
        setPagination,
        resetFilters,
        resetSorting,
        resetPagination,
        resetAll,
    };
}