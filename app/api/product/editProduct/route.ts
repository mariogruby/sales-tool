import Product from "@/models/product";
import Restaurant from "@/models/restaurant";
import Category from "@/models/category";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function PUT(req: NextRequest) {
    const { productId, name, price, isAvailable, categoryId } = await req.json();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const parsedPrice = Number(price);

    if (!productId || !name || parsedPrice === undefined || !categoryId) {
        return NextResponse.json(
            { message: "Todos los campos son requeridos" },
            { status: 400 }
        );
    }

    if (isNaN(parsedPrice)) {
        return NextResponse.json(
            { message: "Precio inválido" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const restaurant = await Restaurant.findById(token.id).lean();
        if (!restaurant) {
            return NextResponse.json(
                { message: "Restaurante no encontrado" },
                { status: 404 }
            );
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { message: "Producto no encontrado" },
                { status: 404 }
            );
        }

        if (!product.restaurant || product.restaurant.toString() !== token.id) {
            return NextResponse.json(
                { message: "El producto no pertenece a este restaurante" },
                { status: 403 }
            );
        }

        const newCategory = await Category.findById(categoryId);
        if (!newCategory) {
            return NextResponse.json(
                { message: "Categoría no encontrada" },
                { status: 404 }
            );
        }

        if (newCategory.restaurant.toString() !== token.id) {
            return NextResponse.json(
                { message: "La categoría no pertenece a este restaurante" },
                { status: 403 }
            );
        }

        const oldCategoryId = product.category?.toString();

        // ✅ Actualizar producto
        product.name = name;
        product.price = parsedPrice;
        product.isAvailable = isAvailable;
        product.category = categoryId;
        await product.save();

        // 🔥 Si la categoría cambió, actualizar los modelos de categoría
        if (oldCategoryId && oldCategoryId !== categoryId) {
            // Quitar de la categoría anterior
            await Category.findByIdAndUpdate(oldCategoryId, {
                $pull: { products: productId },
            });
        }

        // Agregar a la nueva categoría (solo si no estaba ya)
        if (!newCategory.products.includes(product._id)) {
            newCategory.products.push(product._id);
            await newCategory.save();
        }

        return NextResponse.json(
            { product },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
