"use client"

import { TrendingUp } from "lucide-react"
import { Line, LineChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useSalesSummary } from "@/hooks/sales/use-sales-summary"
import { SkeletonGraph } from "@/app/dashboard/components/sales/graphSales/skeletons"

const chartConfig = {
    total: {
        label: "Ventas",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

export function RecentSalesChart() {
    const { summary, loading, error } = useSalesSummary()

    if (loading || !summary?.recentSales) return <SkeletonGraph />
    if (error) return <p className="p-4 text-red-500">{error}</p>

    const data = summary.recentSales.map((sale) => ({
        date: new Date(sale.date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
        }),
        total: sale.totalAmount,
    }))

    // Calculate trend for footer (example: compare first and last sale)
    const trend = data.length > 1
        ? ((data[data.length - 1].total - data[0].total) / data[0].total) * 100
        : 0

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardDescription>
                    Mostrando las ventas recientes
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
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
                            content={<ChartTooltipContent indicator="dot" hideLabel />}
                        />
                        <Line
                            dataKey="total"
                            type="linear"
                            stroke="var(--color-total)"
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            {trend > 0
                                ? `Subiendo un ${trend.toFixed(1)}%`
                                : `Bajando un ${Math.abs(trend).toFixed(1)}%`}
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            {data[0]?.date} - {data[data.length - 1]?.date}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}