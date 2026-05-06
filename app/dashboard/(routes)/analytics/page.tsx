"use client";

import { ProtectedRouteGuard } from "@/app/providers/protected-route-guard";
import { usePathname } from "next/navigation";
import { MonthlyTrendChart } from "./components/monthly-trend-chart";
import { RecentSalesChart } from "./components/recent-sales-chart";
import { TodayVsYesterdayChart } from "./components/today-vs-yesterday-chart";
import { useSalesSummary } from "@/hooks/sales/use-sales-summary";

const Page = () => {
    const pathname = usePathname();
    const { summary, loading, error } = useSalesSummary();

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className="flex flex-col gap-6 p-4">
                <TodayVsYesterdayChart summary={summary} loading={loading} error={error} />
                <MonthlyTrendChart summary={summary} loading={loading} error={error} />
                <RecentSalesChart summary={summary} loading={loading} error={error} />
            </div>
        </ProtectedRouteGuard>
    );
}

export default Page;