/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcryptjs'
import Restaurant from '@/models/restaurant'
import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'

export async function POST(request: Request) {
    const {name, email, password, confirmPassword} = await request.json();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    }
    if(!name || !email || !password || !confirmPassword) {
        return NextResponse.json({message: "All fields required"}, {status:400})
    }
    if(!isValidEmail(email)) {
        return NextResponse.json({message: "Invalid email format"}, {status:400})
    }
    if(confirmPassword !== password) {
        return NextResponse.json({message: "Password do not match"}, {status:400})
    }
    if(password.length < 6) {
        return NextResponse.json({message: "Password must be at least 6 characters long"}, {status:400})
    }

    try {
        await connectToDatabase()
        const existingRestaurant = await Restaurant.findOne({email});
        if(existingRestaurant) {
            return NextResponse.json({message: "Restaurant Account exist"}, {status:400})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newRestaurant = new Restaurant({
            email,
            name,
            password: hashedPassword
        });
        await newRestaurant.save()
        return NextResponse.json({message:"Restaurant Account created"}, {status:201})
    } catch (error) {
        return NextResponse.json({message:"Something went wrong"}, {status:500})
    }

} 