"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function MonthlyTrendChart() {
    const { summary, loading, error } = useSalesSummary()

    if (loading || !summary) return <SkeletonGraph />
    if (error) return <p className="p-4 text-red-500">{error}</p>

    const estimatedLastMonth = summary.month / (1 + summary.changeMonth / 100)

    const data = [
        { name: "L", total: Number(estimatedLastMonth.toFixed(2)) },
        { name: "R", total: summary.month },
    ]

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Tendencia Mensual</CardTitle>
                <CardDescription>
                    Comparación de ventas del mes anterior vs. mes actual
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" hideLabel />}
                        />
                        <Area
                            dataKey="total"
                            type="linear"
                            fill="var(--color-total)"
                            fillOpacity={0.4}
                            stroke="var(--color-total)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            {summary.changeMonth > 0
                                ? `Subiendo un ${summary.changeMonth.toFixed(0)}% este mes`
                                : `Bajando un ${Math.abs(summary.changeMonth).toFixed(0)}% este mes`}
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            Mes anterior (L) - Mes actual (R)
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}