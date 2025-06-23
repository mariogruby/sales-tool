// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: '/sign-in',
    },
})

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/product/:path*",
        "/api/sale/:path*",
    ]
}

