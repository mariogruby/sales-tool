"use client";

import { useState } from "react";
import { useSalesSummary } from "@/hooks/sales/use-sales-summary";
import { ChartAreaInteractive } from "@/app/dashboard/components/sales/graphSales/chart-area-interactive";
import { SectionCards } from "@/app/dashboard/components/sales/SalesSummary/section-cards";
import { DataTable } from "@/app/dashboard/components/sales/recentSales/data-table";
import { recentSalesColumns } from "@/app/dashboard/components/sales/recentSales/colums";
import { DataTableOpenDays } from "./components/sales/openDays/data-table-open-days";
import { useOpenDaysColumns } from "./components/sales/openDays/columns";
import { CloseDayModal } from "./components/closeDay/close-day-modal";

export default function DashboardHomePage() {
  const { summary, loading, error } = useSalesSummary();
  const openDays = summary?.openDays ?? [];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | undefined>();

  const handleOpenModal = (dailySalesId: string) => {
    setSelectedDayId(dailySalesId);
    setModalOpen(true);
  };

  const openDaysColumns = useOpenDaysColumns(handleOpenModal);

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

        {openDays.length > 0 && (
          <>
            <h2 className="mt-4 mb-4 text-lg font-semibold">Cierre de ventas pendientes</h2>
            <DataTableOpenDays
              columns={openDaysColumns}
              data={openDays}
              loading={loading}
              error={error}
            />
          </>
        )}
      </div>

      <CloseDayModal
        open={modalOpen}
        setOpen={setModalOpen}
        dailySalesId={selectedDayId}
      />
    </>
  );
}
