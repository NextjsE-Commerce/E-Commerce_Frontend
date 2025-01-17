
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminRoutes = ["/admin/dashboard", "/admin/addproduct", "/admin/updateproduct"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  let url = request.url


  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route) 
  );

  if (isAdminRoute) {
    if (!token) {

      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url)); 
      }
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

