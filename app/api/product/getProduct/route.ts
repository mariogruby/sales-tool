import "@/models/product";
// console.log("Product model loaded");
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import Restaurant from "@/models/restaurant";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const restaurant = await Restaurant.findById(token.id).populate("products").lean();

        return NextResponse.json(
            { products: restaurant?.products || [] },
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
