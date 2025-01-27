
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "js-cookie";

const adminRoutes = ["/admin/dashboard", "/admin/addproduct", "/admin/updateproduct"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  let cookie = request.cookies.get('access_token')
  let url = request.url

  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route) 
  );

  if (isAdminRoute) {
    if (!cookie) {
      // console.log(cookie)

      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = request.cookies.get("role")?.value; 

    if(role !== "admin"){
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

  }

    // Prevent logged-in users from accessing /login
    if (request.nextUrl.pathname === "/login" && token) {
      const role = request.cookies.get("role")?.value; 
      if(role == "admin"){
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    // if (request.nextUrl.pathname === "/" && token) {
    //   const role = request.cookies.get("role")?.value; 
    //   if(role == "admin"){
    //     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    //   }
    //   return NextResponse.redirect(new URL("/", request.url));
    // }

  return NextResponse.next();
}



