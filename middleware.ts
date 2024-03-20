import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
    console.log(req.nextUrl.pathname)
    if (req.nextUrl.pathname.startsWith('/product')) {
        NextResponse.rewrite(new URL('/', req.url))
    }
}

// export const config = {
//     matcher: '/product/:path*',
// }