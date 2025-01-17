
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
      console.log(cookie)

      return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = request.cookies.get("role")?.value; 

    if(role !== "admin"){
      return NextResponse.redirect(new URL("/", request.url));
    }

  }

    // Prevent logged-in users from accessing /login
    if (request.nextUrl.pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

  return NextResponse.next();
}


// import axios from "axios";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const adminRoutes = ["/admin/dashboard", "/admin/addproduct", "/admin/updateproduct"];

// export async function middleware(request: NextRequest) {
//   const cookie = request.cookies.get("access_token");


//   const isAdminRoute = adminRoutes.some((route) =>
//     request.nextUrl.pathname.startsWith(route)
//   );
//   const isLoginRoute = request.nextUrl.pathname === "/login";

//   if (isAdminRoute) {
//     if (!cookie) {

//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//     // const response = await axios.post("http://localhost:8000/api/validateToken", {}, {
//     //   headers: {
//     //     'Authorization': `Bearer ${cookie}`,
//     //   },
//     // });
//     // if (response.data.role !== "admin") {
//     //   return NextResponse.redirect(new URL("/", request.url));
//     // }

//     // // Prevent logged-in users from accessing the /login route
//     // if (isLoginRoute && cookie) {
//     //   try {
//     //     const payload = JSON.parse(atob(cookie.value.split(".")[1]));
//     //     if (payload) {

//     //       return NextResponse.redirect(new URL("/", request.url));
//     //     }
//     //   } catch (error) {
//     //     console.error("Invalid token:", error); 
//     //   }
  //}


//   return NextResponse.next();
// }

