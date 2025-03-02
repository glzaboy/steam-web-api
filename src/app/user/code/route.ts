'use server'
import { sendMail } from "@/app/lib/mail";
export async function GET() {
    const a = await sendMail({
        to: ["369775479@qq.com"],
        subject: "Hello",
        text: "Hello",
        html: "<h1>Hello</h1>",
        from: "369775479@qq.com",
    });
    console.log(a);
    return new Response("ok" + a);
}