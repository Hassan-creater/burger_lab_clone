import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/login_status`,
    {
      cache: "no-store",
      credentials: "include",
      headers: {
        cookie: req.headers.get("cookie") || "",
      }
    }
  );
  const data = await response.json();
  const isAuthenticated = data.status;

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/checkout",
    "/favorites",
    "/orders",
    "/order-complete/:orderId*",
    "/addresses",
    "/profile",
  ],
};
