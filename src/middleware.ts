import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const res = NextResponse.next();

    res.headers.set("Access-Control-Allow-Origin", "https://admin.onecarta.shop");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, x-admin-key");

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: res.headers });
    }

    return res;
  }
}

export const config = {
  matcher: "/api/:path*",
};