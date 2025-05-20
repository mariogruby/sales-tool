// app/dashboard/page.tsx
import { ChartAreaInteractive } from "@/app/dashboard/components/sales/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/app/dashboard/components/sales/section-cards"
import data from "./data.json"

export default function DashboardHomePage() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  )
}
