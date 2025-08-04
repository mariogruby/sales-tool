import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import Restaurant from "@/models/restaurant";
import connectToDatabase from "@/lib/mongodb";

export async function PUT(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const { name, email, phoneNumber, direction, securityCode, securityCodeEnabled, protectedRoutes,  } = await req.json();

        if (!name || !email) {
            return NextResponse.json(
                { message: "Name and Email is required" },
                { status: 400 }
            );
        }

        if (securityCode && !/^\d{6}$/.test(securityCode)) {
            return NextResponse.json(
                { message: "Security code must be exactly 6 digits" },
                { status: 400 }
            );
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            token.id,
            {
                $set: {
                    name,
                    email,
                    phoneNumber,
                    direction,
                    ...(securityCode && { securityCode }),
                    securityCodeEnabled,
                    protectedRoutes,
                },
            },
            { new: true, runValidators: true, context: 'query' }
        ).select("name email phoneNumber direction securityCode securityCodeEnabled protectedRoutes createdAt");

        if (!updatedRestaurant) {
            return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
        }

        return NextResponse.json({ restaurant: updatedRestaurant }, { status: 200 });

    } catch (error) {
        console.error("Error updating account data:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
