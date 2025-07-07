import Product from "@/models/product"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

export async function PUT(req: NextRequest) {
    const { products }: { products: { _id: string; order: number }[] } = await req.json()
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        await connectToDatabase()

        for (const { _id, order } of products) {
            await Product.updateOne(
                { _id, restaurant: token.id },
                { $set: { order } }
            )
        }

        return NextResponse.json({ message: "Orden actualizado" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
    }
}
