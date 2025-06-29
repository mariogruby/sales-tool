import NextAuth from "next-auth";
import Restaurant from "@/models/restaurant";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";

const handler = NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                try {
                    await connectToDatabase()
                    const restaurant = await Restaurant.findOne({ email: credentials?.email })
                    if (!restaurant) {
                        throw new Error("Esta cuenta no está registrada")
                    }
                    const isValidPassword = await bcrypt.compare(
                        credentials?.password ?? "", restaurant.password as string
                    )
                    if (!isValidPassword) {
                        throw new Error("Email o contraseña invalidas")
                    }
                    return restaurant
                } catch {
                    return null
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id || token.sub;
                token.email = user.email
            }
            return token
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id, // almacena el id en el session token
                    email: token.email,
                    name: token.name,
                    image: token.picture,
                }
            }
            // console.log(session)
            return session
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }