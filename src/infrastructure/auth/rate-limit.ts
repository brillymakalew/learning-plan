// Simple in-memory rate limiter for MVP
// In a serverless environment (Vercel), this memory is ephemeral, 
// but sufficient to slow down basic brute force scripts.

const rateLimitMap = new Map<string, { count: number; lastAttempt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

export function rateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record) {
        rateLimitMap.set(ip, { count: 1, lastAttempt: now });
        return true;
    }

    if (now - record.lastAttempt > WINDOW_MS) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, lastAttempt: now });
        return true;
    }

    if (record.count >= MAX_ATTEMPTS) {
        return false;
    }

    record.count += 1;
    record.lastAttempt = now;
    return true;
}
