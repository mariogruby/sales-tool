import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import connectToDatabase from "@/lib/mongodb"
import Category from "@/models/category"


export async function PUT(req: NextRequest) {
    const { categoryId, name, color } = await req.json()

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!name && !color) {
        return NextResponse.json(
            { message: "Se requiere al menos un campo para actualizar" },
            { status: 400 }
        )
    }

    if (!categoryId) {
        return NextResponse.json({ message: "ID de categoría requerido" }, { status: 400 })
    }

    try {
        await connectToDatabase()

        const category = await Category.findOne({
            _id: categoryId,
            restaurant: token.id,
        })

        if (!category) {
            return NextResponse.json({ message: "Categoría no encontrada" }, { status: 404 })
        }

        if (name !== undefined && name.trim() !== "") category.name = name
        if (color !== undefined && color.trim() !== "") category.color = color        

        await category.save()

        return NextResponse.json({ message: "Categoría actualizada", category }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Error en el servidor" }, { status: 500 })
    }
}
