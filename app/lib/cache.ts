import { getCloudflareContext } from "@opennextjs/cloudflare";

export class CacheError extends Error {
    constructor(message: string, public readonly code: string) {
        super(message);
        this.name = 'CacheError';
    }
}

export const readCache = async <T>(
    key: string
): Promise<T | null> => {
    try {
        if (typeof getCloudflareContext === 'undefined') {
            throw new CacheError('Cloudflare 环境不可用', 'ENV_NOT_AVAILABLE');
        }

        const { env } = getCloudflareContext();

        if (!env?.KEY_CACHE) {
            throw new CacheError('缓存服务未配置', 'CACHE_NOT_CONFIGURED');
        }

        const data = await env.KEY_CACHE.get<T>(key, { type: 'json' });
        console.log(`缓存获取结果: ${key}`, data);
        if (data === null) {
            console.warn(`缓存未命中: ${key}`);
            return null;
        }

        return data as T;
    } catch (error) {
        console.error('缓存获取失败:', error);

        if (error instanceof CacheError) {
            throw error;
        }

        throw new CacheError(
            `未知缓存错误: ${error instanceof Error ? error.message : 'Unknown error'}`,
            'UNKNOWN_CACHE_ERROR'
        );
    }
};

export const writeCache = async <T>(
    key: string,
    value: T,
    options: {
        ttl?: number;
    } = {}
): Promise<void> => {
    try {
        if (typeof getCloudflareContext === 'undefined') {
            throw new CacheError('Cloudflare 环境不可用', 'ENV_NOT_AVAILABLE');
        }

        const { env } = getCloudflareContext();

        if (!env?.KEY_CACHE) {
            throw new CacheError('缓存服务未配置', 'CACHE_NOT_CONFIGURED');
        }

        if (options.ttl === undefined) {
            options.ttl = 60; // 默认 TTL 为 60 秒
        }

        await env.KEY_CACHE.put(
            key,
            JSON.stringify(value),
            {
                expirationTtl: options.ttl,
                metadata: {
                    timestamp: Date.now(),
                    ttl: options.ttl,
                }
            }
        );

        console.log(`缓存写入成功: ${key}`);
    } catch (error) {
        console.error('缓存写入失败:', error);

        if (error instanceof CacheError) {
            throw error;
        }

        throw new CacheError(
            `未知写入错误: ${error instanceof Error ? error.message : 'Unknown error'}`,
            'UNKNOWN_WRITE_ERROR'
        );
    }
};
