"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
import { formatPrice } from "@/lib/formatPrice"

const chartConfig = {
    total: {
        label: "Ventas",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function TodayVsYesterdayChart() {
    const { summary, loading, error } = useSalesSummary()

    if (loading || !summary) return <SkeletonGraph />
    if (error) return <p className="p-4 text-red-500">{error}</p>

    const estimatedYesterday = summary.day / (1 + summary.changeDay / 100)

    const data = [
        { name: "Ayer", total: Number(estimatedYesterday.toFixed(2)) },
        { name: "Hoy", total: summary.day },
    ]

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Comparación: Hoy vs Ayer</CardTitle>
                <CardDescription>
                    Ventas de hoy comparadas con las de ayer. (debe existir cierre de ayer)
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <BarChart
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
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    hideLabel
                                    valueFormatter={(value: number) =>
                                        `€${formatPrice(value)}`
                                    }
                                />}
                        />
                        <Bar
                            dataKey="total"
                            fill="var(--color-total)"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            {summary.changeDay > 0
                                ? `Subiendo un ${summary.changeDay.toFixed(2)}% hoy`
                                : `Bajando un ${Math.abs(summary.changeDay).toFixed(2)}% hoy`}
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            Ayer - Hoy
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}