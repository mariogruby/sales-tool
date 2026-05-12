import { useCallback, useEffect, useState } from "react"
import { useSalesSummaryStore } from "@/zustand/use-sales-summary-store"

export function useSalesGraph(timeRange: string) {
    const [chartData, setChartData] = useState<
        { date: string; total: number; efectivo: number; tarjeta: number }[]
    >([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const { setRefetchGraph } = useSalesSummaryStore()

    const doFetch = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoading(true)
            const res = await fetch("/api/sales/graph", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ timeRange }),
                signal,
            })
            const data = await res.json()
            if (res.ok) {
                setChartData(data)
            } else {
                setError(data.message)
            }
        } catch (err) {
            if ((err as Error).name === "AbortError") return
            console.error("Error fetching data charts", err)
            setError("Error del servidor")
        } finally {
            if (!signal?.aborted) setLoading(false)
        }
    }, [timeRange])

    useEffect(() => {
        const controller = new AbortController()
        doFetch(controller.signal)
        return () => controller.abort()
    }, [doFetch])

    useEffect(() => {
        setRefetchGraph(() => doFetch())
    }, [doFetch, setRefetchGraph])

    return { chartData, loading, error, refetch: () => doFetch() }
}
