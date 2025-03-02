
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface EmailData {
    from: string;
    to: string[];
    subject: string;
    text: string;
    html?: string;
}

/**
 * 发送邮件的函数
 *
 * @param data 邮件数据对象，需要包含发送邮件所需的所有信息
 * @returns 成功发送邮件时，返回邮件发送结果的JSON对象；失败时，抛出错误信息
 * @throws 当邮件发送失败时，抛出包含错误信息的Error对象
 */
export async function sendMail(data: EmailData) {
    const cloudflareCtx = await getCloudflareContext({ async: true });
    data.from = "steam@sda.steamsda.com";
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cloudflareCtx.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify(data),
        cache: "no-store" as RequestCache, // no-store 防止缓存，防止重复发送邮件

    };
    const result = await fetch(`https://api.resend.com/emails`, opts)
    if (result.ok) {
        return result.json()
    } else {
        throw new Error(await result.text())
    }
}