import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { IRestaurant } from "@/types/restaurant"
import { Skeleton } from "@/components/ui/skeleton"
import { Store } from "lucide-react";


interface ProfileDataProps {
    loading: boolean
    error: string
    accountData: IRestaurant | null;
}

export function ProfileData({ loading, error, accountData }: ProfileDataProps) {

    if (error) return <p className="text-destructive">{error}</p>;

    if (loading) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="text-center space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-60" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-1">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-5 w-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    if (!accountData) return null;
    return (
        <Card className="mt-5 w-full max-w-md">
            <CardHeader className="flex flex-col items-center gap-4">

                    <div className="flex h-full w-full items-center justify-center rounded-full">
                        <Store className="h-10 w-10 text-muted-foreground" />
                    </div>

                <div className="text-center">
                    <CardTitle>{accountData?.name}</CardTitle>
                    <CardDescription>{accountData?.email}</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div>
                    <Label className="text-muted-foreground">Nombre del negocio</Label>
                    <p className="text-base">{accountData?.name}</p>
                </div>

                <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-base">{accountData?.email}</p>
                </div>

                <div>
                    <Label className="text-muted-foreground">Número de teléfono</Label>
                    <p className="text-base">{accountData?.phoneNumber || "-"}</p>
                </div>

                <div>
                    <Label className="text-muted-foreground">Dirección</Label>
                    <p className="text-base">{accountData?.direction || "-"}</p>
                </div>

                <div>
                    <Label className="text-muted-foreground">Creación de la cuenta</Label>
                    <p className="text-base">
                        {accountData?.createdAt ? new Date(accountData.createdAt).toLocaleDateString() : ""}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
