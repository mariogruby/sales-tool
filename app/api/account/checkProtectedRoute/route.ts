import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import Restaurant from "@/models/restaurant";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const { route, securityCode } = await req.json();

        const restaurant = await Restaurant.findById(token.id)
            .select("protectedRoutes securityCode securityCodeEnabled")
            .lean();

        if (!restaurant) {
            return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
        }

        // check if the route is protected and if securityCodeEnabled is active in the DB
        if (
            restaurant.securityCodeEnabled &&
            restaurant.protectedRoutes.includes(route)
        ) {
            // if securityCode is required, validates the code provided from the client
            if (!securityCode || securityCode !== restaurant.securityCode) {
                return NextResponse.json(
                    { message: "Invalid security code", requiresSecurityCode: true },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json(
            { message: "Authorized", requiresSecurityCode: false },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking protected routes", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}