"use client"
import { auth } from "@/auth"
//import { signIn } from "@/auth"
import { Button } from "antd"
import { signIn } from "next-auth/react"

export default function Home() {
  return <Button onClick={() => signIn()}>Sign In</Button>
  return <>
    <button onClick={() => {
      signIn();
    }}>Sign in</button >
  </>

}
