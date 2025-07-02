"use client";

import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard";
import { usePathname } from "next/navigation";
import { MonthlyTrendChart } from "./components/monthly-trend-chart";
import { RecentSalesChart } from "./components/recent-sales-chart";
import { TodayVsYesterdayChart } from "./components/today-vs-yesterday-chart";

const Page = () => {
    const pathname = usePathname()

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className="flex flex-col gap-6 p-4">
                <TodayVsYesterdayChart />
                <MonthlyTrendChart />
                <RecentSalesChart />
            </div>
        </ProtectedRouteGuard>
    );
}

export default Page;