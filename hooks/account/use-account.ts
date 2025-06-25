import { useEffect, useState } from "react";
import { IRestaurant } from "@/types/restaurant";

export function useAccount() {
    const [accountData, setAccountData] = useState<IRestaurant | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchData = async () => {

        setLoading(true)
        try {
            const res = await fetch("/api/account/getUserData")

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Error fetching data");
                return false
            }
            setAccountData(data.restaurant)
            setError("");
            return true
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error fetching data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return { accountData, loading, error, fetchData }
}