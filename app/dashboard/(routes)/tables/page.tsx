"use client"

import { useTables } from "@/hooks/use-tables";
import AllTables from "./components/all-tables";


const Page = () => {
    const { tables, loading, error } = useTables();
    return (
        <div>
            <AllTables
                tables={tables}
                loading={loading}
                error={error}
            />
        </div>
    );
}

export default Page;