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
 * @param data 邮件数据对象，from字段将被固定值覆盖
 * @throws 当邮件发送失败或配置错误时，抛出包含错误信息的Error对象
 */
export async function sendMail(data: EmailData) {
    const cloudflareCtx = await getCloudflareContext({ async: true });

    if (!cloudflareCtx.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY 未配置");
    }

    const emailData = { ...data, from: "steam@sda.steamsda.com" };

    const opts: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cloudflareCtx.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailData),
        cache: "no-store"
    };

    try {
        const result = await fetch("https://api.resend.com/emails", opts);

        if (result.ok) {
            return await result.json();
        } else {
            const errorText = await result.text();
            try {
                const errorBody = JSON.parse(errorText) as { message?: string };
                throw new Error(errorBody.message || errorText);
            } catch {
                throw new Error(errorText);
            }
        }
    } catch (error) {
        // 类型安全地处理错误信息
        let errorMessage = "未知错误";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }
        throw new Error(`发送邮件失败: ${errorMessage}`);
    }
}