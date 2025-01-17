import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const NEXTAUTH_SECRET=process.env.NEXTAUTH_SECRET!


export const authOptions = {
    // session: {
    //     strategy: "jwt",
    // },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    ],

    secret: NEXTAUTH_SECRET, 
    // pages: {
    //     signIn: '/login', 
    // },
};

const handeler = NextAuth(authOptions)

export { handeler as GET, handeler as POST }