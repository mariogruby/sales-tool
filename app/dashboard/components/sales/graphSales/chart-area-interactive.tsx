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
import { useSalesGraph } from "@/hooks/sales/use-sales-graph"
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
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <CardTitle>Total Ventas</CardTitle>
      <CardDescription>
        <span className="hidden sm:inline">Total for the last 3 months</span>
        <span className="sm:hidden">Last 3 months</span>
      </CardDescription>
    </div>

    <CardAction>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        {/* ToggleGroup: visible en md y arriba */}
        <ToggleGroup
          type="single"
          value={timeRange}
          onValueChange={setTimeRange}
          variant="outline"
          className="hidden md:flex *:data-[slot=toggle-group-item]:!px-4"
        >
          <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
          <ToggleGroupItem value="30d">Últimos 30 días</ToggleGroupItem>
          <ToggleGroupItem value="7d">Últimos 7 días</ToggleGroupItem>
        </ToggleGroup>

        {/* Select para el time range (visible solo en móvil) */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40 md:hidden" size="sm">
            <SelectValue placeholder="Rango de tiempo" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Últimos 3 meses</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
          </SelectContent>
        </Select>

        {/* Select común para tipo de datos */}
        <Select value={dataType} onValueChange={setDataType}>
          <SelectTrigger className="w-40" size="sm">
            <SelectValue placeholder="Tipo de dato" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="total">Total</SelectItem>
            <SelectItem value="efectivo-tarjeta">Efectivo + Tarjeta</SelectItem>
            <SelectItem value="efectivo">Efectivo</SelectItem>
            <SelectItem value="tarjeta">Tarjeta</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardAction>
  </div>
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
