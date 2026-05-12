"use client";

import { useState } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SummaryDayContent } from "./summary-day-details";
import { formatPrice } from "@/lib/formatPrice";
import { SkeletonSectionCards } from "./skeletons";
import { SummaryMonthContent } from "./summary-month-details";
import { SalesSummary } from "@/types/sale-client";
import { SummaryYearContent } from "./summary-year-details";

interface SectionCardsProps {
  summary: SalesSummary | null | undefined;
  loading: boolean;
  error: string | null;
}

export function SectionCards({ summary, loading, error }: SectionCardsProps) {
  const [open, setOpen] = useState(false);
  const [openMonthDetails, setOpenMonthDetails] = useState(false);
  const [openYearDetails, setOpenYearDetails] = useState(false);

  const formatChange = (value: number) => {
    const icon =
      value >= 0 ? (
        <IconTrendingUp className="shrink-0 text-green-500" />
      ) : (
        <IconTrendingDown className="shrink-0 text-destructive" />
      );
    const label = `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
    return (
      <>
        <span className="hidden @[200px]/card:inline">{label}</span>
        {icon}
      </>
    );
  };

  const getTrendText = (
    value: number,
    positiveText: string,
    negativeText: string,
  ) => (value >= 0 ? positiveText : negativeText);

  if (loading) return <SkeletonSectionCards />;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!summary) return null;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total del día */}
      <Sheet open={open} onOpenChange={setOpen}>
        <Card
          className="@container/card cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <CardHeader>
            <CardDescription>Total del día</CardDescription>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <CardTitle className="min-w-0 truncate text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                €{formatPrice(summary.day)}
              </CardTitle>
              <Badge variant="outline" className="shrink-0 gap-1">
                {formatChange(summary.changeDay || 0)}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {getTrendText(
                summary.changeDay || 0,
                "Ventas en aumento",
                "Ventas en baja",
              )}
              {summary.changeDay >= 0 ? (
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
      <Sheet open={openMonthDetails} onOpenChange={setOpenMonthDetails}>
        <Card
          className="@container/card cursor-pointer"
          onClick={() => setOpenMonthDetails(true)}
        >
          <CardHeader>
            <CardDescription>Total del mes</CardDescription>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <CardTitle className="min-w-0 truncate text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                €{formatPrice(summary.month)}
              </CardTitle>
              <Badge variant="outline" className="shrink-0 gap-1">
                {formatChange(summary.changeMonth || 0)}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {getTrendText(
                summary.changeMonth || 0,
                "Mejor que el mes pasado",
                "Peor que el mes pasado",
              )}
              {summary.changeMonth >= 0 ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">
              Comparado con el mes anterior
            </div>
          </CardFooter>
        </Card>
        <SheetContent className="w-full flex">
          <SummaryMonthContent
            cashMonthTotal={summary.cashTotalMonth || 0}
            cardMonthTotal={summary.cardTotalMonth || 0}
          />
        </SheetContent>
      </Sheet>

      {/* Acumulado anual */}
      <Sheet open={openYearDetails} onOpenChange={setOpenYearDetails}>
        <Card className="@container/card cursor-pointer"
        onClick={() => setOpenYearDetails(true)}
        >
          <CardHeader>
            <CardDescription>Acumulado anual</CardDescription>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <CardTitle className="min-w-0 truncate text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                €{formatPrice(summary.year)}
              </CardTitle>
              <Badge variant="outline" className="shrink-0 gap-1">
                {formatChange(summary.changeYear || 0)}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {getTrendText(
                summary.changeYear || 0,
                "Buen rendimiento anual",
                "Rendimiento anual bajo",
              )}
              {summary.changeYear >= 0 ? (
                <IconTrendingUp className="size-4" />
              ) : (
                <IconTrendingDown className="size-4" />
              )}
            </div>
            <div className="text-muted-foreground">
              Comparado con el año anterior
            </div>
          </CardFooter>
        </Card>
        <SheetContent className="w-full flex">
          <SummaryYearContent
            cashYearTotal={summary.cashTotalYear || 0}
            cardYearTotal={summary.cardTotalYear || 0}
          />
        </SheetContent>
      </Sheet>

      {/* Promedio diario */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Promedio diario (mes)</CardDescription>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <CardTitle className="min-w-0 truncate text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              €{formatPrice(summary.month / new Date().getDate())}
            </CardTitle>
            <Badge variant="outline" className="shrink-0 gap-1">
              <span className="hidden @[200px]/card:inline">Consistente</span>
              <IconTrendingUp className="shrink-0 text-green-500" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Rendimiento estable <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Comparado con días previos
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
