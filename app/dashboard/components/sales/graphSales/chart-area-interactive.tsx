"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useSalesGraph } from "@/hooks/use-sales-graph"
import { SkeletonGraph } from "./skeletons"

export const description = "An interactive area chart"

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--primary)",
  },
  efectivo: {
    label: "Efectivo",
    color: "#10b981", // verde
  },
  tarjeta: {
    label: "Tarjeta",
    color: "#3b82f6", // azul
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [dataType, setDataType] = React.useState("total") // valor inicial actualizado
  const { chartData, loading, error } = useSalesGraph(timeRange)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  if (loading) return <SkeletonGraph />
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Ventas</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <div className="flex gap-4">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Ultimos 3 meses</ToggleGroupItem>
              <ToggleGroupItem value="30d">Ultimos 30 dias</ToggleGroupItem>
              <ToggleGroupItem value="7d">Ultimos 7 dias</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Ultimos 3 meses
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Ultimos 30 dias
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Ultimos 7 dias
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                size="sm"
                aria-label="Select data type"
              >
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="total" className="rounded-lg">
                  Total
                </SelectItem>
                <SelectItem value="efectivo-tarjeta" className="rounded-lg">
                  Efectivo + Tarjeta
                </SelectItem>
                <SelectItem value="efectivo" className="rounded-lg">
                  Efectivo
                </SelectItem>
                <SelectItem value="tarjeta" className="rounded-lg">
                  Tarjeta
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData} width={800} height={400}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={1} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillEfectivo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillTarjeta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                })
              }
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  valueFormatter={(value: number) =>
                    `€${value.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`
                  }
                  indicator="dot"
                />
              }
            />
            {(dataType === "total") && (
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                stroke="var(--primary)"
              />
            )}
            {(dataType === "efectivo-tarjeta" || dataType === "efectivo") && (
              <Area
                dataKey="efectivo"
                type="natural"
                stroke="#10b981"
                fill="url(#fillEfectivo)"
              />
            )}
            {(dataType === "efectivo-tarjeta" || dataType === "tarjeta") && (
              <Area
                dataKey="tarjeta"
                type="natural"
                stroke="#3b82f6"
                fill="url(#fillTarjeta)"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
