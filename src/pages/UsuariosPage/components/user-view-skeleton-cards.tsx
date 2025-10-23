import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const UserViewSkeletonCards = () => (
    <div className="space-y-4">
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Skeleton className="h-16 w-16 rounded-full" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">
                            <Skeleton className="h-8 w-56" />
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-6 w-24">
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>

        {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-48" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <Skeleton className="h-5 w-5" />
                                <div>
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
)
