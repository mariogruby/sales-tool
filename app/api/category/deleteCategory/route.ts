import Category from "@/models/category";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function DELETE(req: NextRequest) {
    const { categoryId } = await req.json();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!categoryId) {
        return NextResponse.json(
            { message: "Category ID is required" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const category = await Category.findById(categoryId);

        if (!category) {
            return NextResponse.json(
                { message: "Category no encontrada" },
                { status: 404 }
            );
        }

        if (category.restaurant.toString() !== token.id) {
            return NextResponse.json(
                { message: "Unauthorized to delete this category" },
                { status: 403 }
            );
        }

        if (category.products.length > 0) {
            return NextResponse.json(
                { message: "No puedes eliminar categorias con productos asociados, mueve los productos a otras categorias para poder eliminar la categoria" },
                { status: 400 }
            );
        }

        await Category.findByIdAndDelete(categoryId);

        return NextResponse.json(
            { message: "Categoría eliminada" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred", error },
            { status: 500 }
        );
    }
}
