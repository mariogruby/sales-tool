"use client";

import {
    IconTrendingDown,
    IconTrendingUp,
} from "@tabler/icons-react"
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useSalesSummary } from "@/hooks/sales/use-sales-summary";
import { SkeletonGraph } from "@/app/dashboard/components/sales/graphSales/skeletons";
import { formatPrice } from "@/lib/formatPrice";

const chartConfig = {
    total: {
        label: "Ventas",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig;

export function RecentSalesChart() {
    const { summary, loading, error } = useSalesSummary();

    if (loading || !summary?.recentSales) return <SkeletonGraph />;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    const data = [...summary.recentSales].reverse().map((sale) => ({
        date: new Date(sale.date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
        }),
        total: sale.totalAmount,
    }));

    // --tendencia basada en promedios de la primera mitad vs segunda mitad
    let trend = 0;
    if (data.length > 1) {
        const half = Math.floor(data.length / 2);

        const firstHalf = data.slice(0, half);
        const secondHalf = data.slice(half);

        const firstHalfAvg =
            firstHalf.reduce((acc, d) => acc + d.total, 0) / firstHalf.length;

        const secondHalfAvg =
            secondHalf.reduce((acc, d) => acc + d.total, 0) / secondHalf.length;

        trend =
            firstHalfAvg > 0
                ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100
                : 0;
    }

    const totalSum = data.reduce((acc, d) => acc + (d.total || 0), 0);

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardDescription>Total de los últimos 10 dias</CardDescription>
                <p className="text-base font-semibold text-primary sm:mt-1 sm:text-lg sm:block">
                    €{formatPrice(totalSum)}
                </p>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    hideLabel
                                    valueFormatter={(value: number) => `€${formatPrice(value)}`}
                                />
                            }
                        />
                        <Line dataKey="total" type="linear" stroke="var(--color-total)" />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            {trend > 0 ? (
                                <>
                                    Subiendo un {trend.toFixed(1)}%
                                    <IconTrendingUp className="h-4 w-4 text-green-500" />
                                </>
                            ) : (
                                <>
                                    Bajando un {Math.abs(trend).toFixed(1)}%
                                    <IconTrendingDown className="h-4 w-4 text-destructive" />
                                </>
                            )}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            {data[0]?.date} - {data[data.length - 1]?.date}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
