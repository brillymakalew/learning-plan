import { cookies } from "next/headers";

const COOKIE_NAME = "owner_mode";
// In production, this should be secure. For localhost, strict is fine.
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export class OwnerAuth {
    static async setOwnerCookie() {
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, "1", {
            httpOnly: true,
            secure: IS_PRODUCTION,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    static async clearOwnerCookie() {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_NAME);
    }

    static async isOwner(): Promise<boolean> {
        const cookieStore = await cookies();
        return cookieStore.has(COOKIE_NAME);
    }

    static verifyKey(inputKey: string): boolean {
        const trueKey = process.env.OWNER_EDIT_KEY;
        if (!trueKey) {
            console.error("OWNER_EDIT_KEY is not set in environment variables!");
            return false;
        }
        return inputKey === trueKey;
    }
}
