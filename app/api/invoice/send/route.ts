import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { generateInvoiceBuffer } from "@/lib/generate-invoice-pdf"
import { sendEmailWithAttachment } from "@/lib/sendEmail"
import connectToDatabase from "@/lib/mongodb"
import Restaurant from "@/models/restaurant"

interface InvoiceItem {
    name: string
    quantity: number
    price: number
}

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { email, items, total } = await req.json() as {
        email: string
        items: InvoiceItem[]
        total: number
    }

    if (!email || !items?.length) {
        return NextResponse.json({ message: "Email e items son requeridos" }, { status: 400 })
    }

    await connectToDatabase()
    const restaurant = await Restaurant.findById(token.id).select("name direction phoneNumber cif email invoiceIvaEnabled invoiceIvaPercent")
    if (!restaurant) {
        return NextResponse.json({ message: "Restaurant no encontrado" }, { status: 404 })
    }

    const now = new Date()
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Date.now().toString().slice(-5)}`
    const date = now.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })

    const pdfBuffer = await generateInvoiceBuffer({
        items,
        total,
        invoiceNumber,
        date,
        restaurant: {
            name: restaurant.name,
            direction: restaurant.direction ?? "",
            phoneNumber: restaurant.phoneNumber ?? "",
            cif: restaurant.cif ?? "",
            email: restaurant.email,
        },
        iva: restaurant.invoiceIvaEnabled
            ? { enabled: true, percent: restaurant.invoiceIvaPercent ?? 21 }
            : { enabled: false, percent: 0 },
    })

    await sendEmailWithAttachment({
        to: email,
        subject: `Factura ${invoiceNumber} — ${restaurant.name}`,
        html: `<p>Adjuntamos su factura <strong>${invoiceNumber}</strong> del ${date}.</p><p>Total: <strong>€${total.toFixed(2)}</strong></p>`,
        attachment: {
            filename: `${invoiceNumber}.pdf`,
            content: pdfBuffer,
        },
    })

    return NextResponse.json({ message: "Factura enviada" })
}
