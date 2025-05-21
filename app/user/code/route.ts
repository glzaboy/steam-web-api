'use server'
import { sendMail } from "@/app/lib/mail";
import { auth } from "@/auth"
export async function GET() {

    const user = await auth();
    console.log(user?.user?.email);
    const a = await sendMail({
        to: ["369775479@qq.com"],
        subject: "Hello",
        text: "Hello",
        html: "<h1>Hello</h1>",
        from: "369775479@qq.com",
    });
    console.log(a);
    return new Response("ok");
}