import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const ADMIN_EMAILS = [
    "erkigosty@gmail.com",
    "xemorii12@gmail.com",
    "kieko1356@gmail.com"
];

export function proxy(request: NextRequest) {
    if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    } try {
        const user: any = jwtDecode(token);
        if (!ADMIN_EMAILS.includes(user.email)) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
    } catch (error) {
        console.error("Invalid token:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};