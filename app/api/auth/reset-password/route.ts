import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Restaurant from "@/models/restaurant";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: Request) {
    const { token, password } = await req.json();

    if (!token || !password) {
        return NextResponse.json({ message: "Missing token or password" }, { status: 400 });
    }

    await connectToDatabase();

    const restaurant = await Restaurant.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
    });

    if (!restaurant) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    restaurant.password = hashed;
    restaurant.resetToken = null;
    restaurant.resetTokenExpiry = null;
    await restaurant.save();

    return NextResponse.json({ message: "Password successfully reset" });
}
