// 主功能函数

// 定义用户信息类型
export interface Me {
    displayName: string;
    givenName: string;
}

// 定义错误类型
export class GraphApiError extends Error {
    statusCode: number;
    responseBody: string;

    constructor(statusCode: number, responseBody: string) {
        super(`Graph API request failed with status ${statusCode}`);
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }
}

export async function getGraphMeInfo(accessToken: string): Promise<Me | null> {
    if (!accessToken) {
        throw new Error('Access token cannot be null or empty');
    }

    try {
        const apiUrl = new URL('https://graph.microsoft.com/v1.0/me');
        apiUrl.searchParams.append('$select', 'displayName,givenName');

        const response = await fetch(apiUrl.toString(), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        const r1 = response.clone();
        console.log("response", r1.text());
        if (!response.ok) {
            const errorBody = await response.text();
            throw new GraphApiError(response.status, errorBody);
        }

        return await response.json() as Me;
    } catch (error) {
        if (error instanceof GraphApiError) {
            throw error; // 保留自定义错误类型
        }
        throw new Error(`Graph API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}