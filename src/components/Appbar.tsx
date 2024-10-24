'use client'
import { signIn,signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function Appbar(){

    const session = useSession();
    return (
        <div>
            <button onClick={() => signIn()}>SignIn</button>
            <button onClick={() => signOut()}>signOut</button>
            {JSON.stringify(session)}
            
        </div>
    )
}