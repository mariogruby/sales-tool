import NextAuth from "next-auth";
import Restaurant from "@/models/restaurant";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    session: {
        strategy:"jwt"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials : {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                try {
                    await connectToDatabase()
                    const restaurant = await Restaurant.findOne({email: credentials?.email})
                    if (!restaurant) {
                        throw new Error("")
                    }
                    const isValidPassword = await bcrypt.compare(
                        credentials?.password ?? "", restaurant.password as string
                    )
                    if(!isValidPassword) {
                        throw new Error("")
                    }
                    return restaurant
                } catch {
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            if(user) {
                token.id = user.id;
                token.email = user.email
            }
            return token
        },

        async session({session, token}) {
            if (token) {
                session.user = {
                    email: token.email,
                    name: token.name,
                    image: token.picture,
                }
            }
            return session
        }
    }, 
    pages: {
        signIn: "/sign-in"
    },
    secret: process.env.NEXTAUTH_SECRET
})

export {handler as GET, handler as POST}