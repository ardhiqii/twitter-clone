import { MongoDBAdapter } from "@auth/mongodb-adapter"
import NextAuth, { AuthOptions, ISODateString, Session, SessionStrategy } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "../../../../lib/mongodb"
import { JWT } from "next-auth/jwt"


export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  pages:{
    signIn: '/login'
  },
  session:{
    strategy: "jwt" as SessionStrategy,
  },
  callbacks:{
    session:async ({token,session}:CallBackSessionParams) => {
      if(session?.user && token?.sub){
        session.user.id = token.sub
      }
      return session
    }
  }
}

export default NextAuth(authOptions)

interface CallBackSessionParams {
  token:JWT,
  session: CustomSession,
}


export interface CustomSession extends Session{
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    id?: string | null
  }
  expires: ISODateString
}