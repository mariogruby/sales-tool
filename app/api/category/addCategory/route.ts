import Category from "@/models/category";
import Restaurant from "@/models/restaurant";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    const { name, color } = await req.json(); // AÑADIDO: color

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!name) {
        return NextResponse.json(
            { message: "Category name is required" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase()

        const restaurant = await Restaurant.findById(token.id);
        if (!restaurant) {
            return NextResponse.json(
                { message: "Restaurant not found" },
                { status: 404 }
            );
        }

        const existingCategory = await Category.findOne({ name, restaurant: token.id });
        if (existingCategory) {
            return NextResponse.json(
                { message: "Category already exists" },
                { status: 400 }
            );
        }

        const newCategory = new Category({
            name,
            color: color || "bg-slate-100", // AÑADIDO: color
            restaurant: token.id,
        });

        await newCategory.save();

        return NextResponse.json(
            { message: "Category created", Category: newCategory },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
