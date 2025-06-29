import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: '/sign-in',
    },
})

export const config = {
    matcher: [
        "/dashboard/:path*", // <--- client authenticated
        "/api/product/:path*",
        "/api/sales/:path*",
        "/api/table/:path*",
        "/api/account/:path*",
        "/api/category/:path*",
    ]
}

