import { useEffect, useState } from "react"

export function useSalesGraph(timeRange: string) {
    const [chartData, setChartData] = useState<
        { date: string; total: number; efectivo: number; tarjeta: number }[]
    >([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/sales/graph`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ timeRange }),
                })
                const data = await res.json()
                if (res.ok) {
                    setChartData(data)
                } else {
                    setError(data.message)
                }
            } catch (error) {
                console.error("Error fetching data charts", error)
                setError("Error del servidor")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [timeRange])

    return { chartData, loading, error }
}
