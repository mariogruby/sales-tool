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
import { formatPrice } from "@/lib/formatPrice"

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
  const [dataType, setDataType] = React.useState("total")
  const { chartData, loading, error } = useSalesGraph(timeRange)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // funcion de calcular el total acumulado del rango actual de tiempo seleccionado
  const totalSum = React.useMemo(() => {
    if (!chartData) return 0

    if (dataType === "total") {
      return chartData.reduce((acc, d) => acc + (d.total || 0), 0)
    }
    if (dataType === "efectivo") {
      return chartData.reduce((acc, d) => acc + (d.efectivo || 0), 0)
    }
    if (dataType === "tarjeta") {
      return chartData.reduce((acc, d) => acc + (d.tarjeta || 0), 0)
    }
    if (dataType === "efectivo-tarjeta") {
      return chartData.reduce(
        (acc, d) => acc + (d.efectivo || 0) + (d.tarjeta || 0),
        0
      )
    }
    return 0
  }, [chartData, dataType])

  if (loading) return <SkeletonGraph />
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/*bloque de título + total */}
          <div className="flex w-full items-center justify-between sm:block">
            <div>
              <CardTitle>Total Ventas</CardTitle>
              <CardDescription>
                <span className="hidden sm:inline">{`Total en los últimos ${timeRange}:`}</span>
                <span className="sm:hidden">{`Últimos ${timeRange}`}</span>
              </CardDescription>
            </div>

            {/*total: en móviles a la derecha, en sm+ debajo */}
            <p className="text-base font-semibold text-primary sm:mt-1 sm:text-lg sm:block">
              €{formatPrice(totalSum)}
            </p>
          </div>

          <CardAction>
            <div className="flex flex-wrap gap-2 sm:flex-row sm:items-center sm:gap-4">
              {/*ttoggleGroup: visible en md y arriba */}
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden md:flex flex-wrap *:data-[slot=toggle-group-item]:!px-4"
              >
                <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
                <ToggleGroupItem value="30d">Últimos 30 días</ToggleGroupItem>
                <ToggleGroupItem value="7d">Últimos 7 días</ToggleGroupItem>
              </ToggleGroup>

              {/* select para el time range (visible solo en móvil) */}
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-auto md:hidden" size="sm">
                  <SelectValue placeholder="Rango de tiempo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d">Últimos 3 meses</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                </SelectContent>
              </Select>

              {/* select para tipo de datos */}
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger className="sm:ml-auto md:w-40" size="sm">
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
                    `€${formatPrice(value)}`
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
