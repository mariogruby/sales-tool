"use client";

import AllTables from "./components/all-tables";
import { ProtectedRouteGuard } from "@/app/providers/protected-route-guard";
import { usePathname } from "next/navigation";

const Page = () => {
    const pathname = usePathname();

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className="container mx-auto">
                <AllTables />
            </div>
        </ProtectedRouteGuard>
    );
};

export default Page;
