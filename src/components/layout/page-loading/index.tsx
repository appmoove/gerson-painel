import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function PageLoading() {
    return (
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-1 flex-col gap-4 px-4 py-2">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-16" />
                <span className="text-muted-foreground">{'>'}</span>
                <Skeleton className="h-4 w-20" />
                <span className="text-muted-foreground">{'>'}</span>
                <Skeleton className="h-4 w-16" />
            </div>

            {/* Header skeleton */}
            <div className="space-y-2 mt-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96 mt-1" />
            </div>

            <Separator className="my-4" />

            {/* Content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-20 w-full" />
                        <div className="flex justify-between">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
