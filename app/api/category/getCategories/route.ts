import "@/models/product";
import Category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const categories = await Category.find({ restaurant: token.id })
      .populate("products")
      .lean();

    // if (!categories || categories.length === 0) {
    //   return NextResponse.json(
    //     { message: "No categories found for this restaurant" },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json({ categories: categories || []  }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
