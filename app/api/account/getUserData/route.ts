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

        const restaurant = await Restaurant.findById(token.id)
            .select("name email phoneNumber direction securityCode securityCodeEnabled protectedRoutes createdAt")
            .lean();

        if (!restaurant) {
            return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
        }

        return NextResponse.json({ restaurant }, { status: 200 });

    } catch (error) {
        console.error("Error fetching account data:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
