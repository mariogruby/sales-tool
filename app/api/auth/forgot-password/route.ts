import { NextResponse } from "next/server";
import crypto from "crypto";
import Restaurant from "@/models/restaurant";
import connectToDatabase from "@/lib/mongodb";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();
    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant) {
        return NextResponse.json({ message: "No account found with that email" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hora expiracion

    restaurant.resetToken = resetToken;
    restaurant.resetTokenExpiry = expiry;
    await restaurant.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const html = `
    <h1>Recuperar contraseña</h1>
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a>
    <p>Este enlace expirará en 1 hora.</p>
    `;

    await sendEmail(email, "Recupera tu contraseña", html);

    return NextResponse.json({ message: "Password reset link sent to email" });
}
