// src/app/api/logout/route.js
import { cookies } from "next/headers";
import type { NextResponse } from 'next/server'

export async function POST(req) {
  // Remove the access_token cookie on the server
  const headers = new Headers();
  headers.set('Set-Cookie', cookie.serialize('access_token', '', {
    maxAge: -1, // Expire the cookie immediately
    path: '/',  // Make sure it applies to the entire domain
    httpOnly: true,  // If the cookie is HTTP-only, you can't access it with JavaScript
    secure: process.env.NODE_ENV === 'production', // Secure cookies on production
    sameSite: 'Strict', // SameSite policy
  }));

  // Optionally, respond with a message
  return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers,
  });
}
