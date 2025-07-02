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
        const { route, securityCode } = await req.json(); // Recibe la ruta y el securityCode desde el frontend

        const restaurant = await Restaurant.findById(token.id)
            .select("protectedRoutes securityCode securityCodeEnabled")
            .lean();

        if (!restaurant) {
            return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
        }

        // Verifica si la ruta está protegida y si securityCodeEnabled está activo
        if (
            restaurant.securityCodeEnabled &&
            restaurant.protectedRoutes.includes(route)
        ) {
            // Si se requiere securityCode, valida el código proporcionado
            if (!securityCode || securityCode !== restaurant.securityCode) {
                return NextResponse.json(
                    { message: "Invalid security code", requiresSecurityCode: true },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json(
            { message: "Access granted", requiresSecurityCode: false },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking protected route:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}