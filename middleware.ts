import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // Protect dashboard, campaigns, and leads
  const protectedRoutes = ["/dashboard", "/campaigns", "/leads"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware to all protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/campaigns/:path*", "/leads/:path*"],
};
