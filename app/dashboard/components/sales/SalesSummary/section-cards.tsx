"use client"

import { useState } from "react"
import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { SummaryDayContent } from "./summary-day-details"
import { formatPrice } from "@/lib/formatPrice";
import { SkeletonSectionCards } from "./skeletons"

interface Summary {
  day: number
  changeDay: number
  month: number
  changeMonth: number
  year: number
  changeYear: number,
  cashTotal: number;
  cardTotal: number;
}

interface SectionCardsProps {
  summary: Summary | null | undefined
  loading: boolean
  error: string | null
}

export function SectionCards({ summary, loading, error }: SectionCardsProps) {

  const [open, setOpen] = useState(false)

  const formatChange = (value: number) => {
    const icon = value >= 0 ? <IconTrendingUp /> : <IconTrendingDown />
    const label = `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
    return (
      <>
        {icon}
        {label}
      </>
    )
  }

  const getTrendText = (value: number, positiveText: string, negativeText: string) =>
    value >= 0 ? positiveText : negativeText

  if (loading) return <SkeletonSectionCards />
  if (error) return <p className="p-4 text-red-500">{error}</p>
  if (!summary) return null;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total del día */}
      <Sheet open={open} onOpenChange={setOpen}>
        <Card className="@container/card cursor-pointer" onClick={() => setOpen(true)}>
          <CardHeader>
            <CardDescription>Total del día</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              €{formatPrice(summary?.day)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {formatChange(summary?.changeDay || 0)}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {getTrendText(summary?.changeDay || 0, "Ventas en aumento", "Ventas en baja")}
              {summary?.changeDay >= 0 ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">Comparado con ayer</div>
          </CardFooter>
        </Card>
        <SheetContent className="w-full flex">
          <SummaryDayContent
            totalDay={summary.day}
            cashTotal={summary.cashTotal || 0}
            cardTotal={summary.cardTotal || 0}
          />
        </SheetContent>
      </Sheet>

      {/* Total del mes */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total del mes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            €{formatPrice(summary?.month)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {formatChange(summary?.changeMonth || 0)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendText(summary?.changeMonth || 0, "Mejor que el mes pasado", "Peor que el mes pasado")}
            {summary?.changeMonth >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">Comparado con el mes anterior</div>
        </CardFooter>
      </Card>

      {/* Total del año */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Acumulado anual</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            €{formatPrice(summary?.year)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {formatChange(summary?.changeYear || 0)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendText(summary?.changeYear || 0, "Buen rendimiento anual", "Rendimiento anual bajo")}
            {summary?.changeYear >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">Comparado con el año anterior</div>
        </CardFooter>
      </Card>

      {/* promedio diario */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Promedio diario (mes)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            €{formatPrice(summary.month / new Date().getDate())}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Consistente
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Rendimiento estable <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Comparado con días previos</div>
        </CardFooter>
      </Card>
    </div>
  )
}
