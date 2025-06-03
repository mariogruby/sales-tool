import { MonthlyTrendChart } from "./components/monthly-trend-chart";
import { RecentSalesChart } from "./components/recent-sales-chart";
import { TodayVsYesterdayChart } from "./components/today-vs-yesterday-chart";

const Page = () => {
    return (
        <div className="flex flex-col gap-6 p-4">
            <TodayVsYesterdayChart />
            <MonthlyTrendChart />
            <RecentSalesChart />
        </div>
    );
}

export default Page;