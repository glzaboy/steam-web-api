'use server'
import { sendMail } from "@/app/lib/mail";
export async function GET() {
    await sendMail({
        to: ["369775479@qq.com"],
        subject: "Hello",
        text: "Hello",
        html: "<h1>Hello</h1>",
        from: "369775479@qq.com",
    });
    return new Response("ok");
}