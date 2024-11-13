import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from './database';
import bcrypt  from 'bcrypt';


export const NEXT_AUTH_CONFIG = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            username: { label: 'username', type: 'text', placeholder: '' },
            email: { label: 'email', type: 'text', placeholder: '' },
            password: { label: 'password', type: 'password', placeholder: '' },
          },
          async authorize(credentials: any) {
            
            // console.log(credentials);
            const client = await clientPromise;
            const db = client.db("ExamPortal");

            

            const user = await db.collection("User Collection").findOne({ email : credentials?.email});
            
            
            if(user && await bcrypt.compare(credentials.password, user.password) && user.type == credentials?.type){
              console.log(user.type == credentials.type);
              
              
                return {
                  id: user._id.toString(),
                  name: user.username,
                  email: user.email,
                  userId: user.userId,
                };
              }            

            return null;
            
          },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ user, token }: any) => {
        if (user) {
            token.uid = user.id;
        }
        return token;
        },
      session: ({ session, token, user }: any) => {
          if (session.user) {
              session.user.id = token.uid
          }
          return session
      }
    },
    pages: {
      signIn : "/student/signin"
    }
  }