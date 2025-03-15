
import { signIn } from "@/auth"
import { Button } from "antd"
//import { signIn } from "next-auth/react"

export default function Home() {


  return <form action={async () => {
    "use server"
    await signIn()
  }}
  >
    <Button type="primary">Sign in</Button>
  </form>

}
