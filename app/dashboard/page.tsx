"use client";

import { useSalesSummary } from "@/hooks/use-sales-summary";
import { ChartAreaInteractive } from "@/app/dashboard/components/sales/chart-area-interactive";
import { SectionCards } from "@/app/dashboard/components/sales/section-cards";
import { DataTable } from "@/app/dashboard/components/sales/recentSales/data-table";
import { recentSalesColumns } from "@/app/dashboard/components/sales/recentSales/colums";

export default function DashboardHomePage() {
  const { summary, loading, error } = useSalesSummary();

  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Cierres de venta recientes</h2>
        <DataTable
          columns={recentSalesColumns}
          data={summary?.recentSales ?? []}
          loading={loading}
          error={error}
        />
      </div>
    </>
  );
}
