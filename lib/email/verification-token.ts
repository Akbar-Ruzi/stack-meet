import "server-only";

import { createHash, randomBytes } from "node:crypto";

// Only the hash is saved, so someone who can read the database still can't open the link.
// SHA-256 without a salt is enough here: the token is 32 random bytes, so it can't be guessed.
export function hashVerificationToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

// A new random token for a verification link, and the hash to save for it.
export function createVerificationToken(): { token: string; hash: string } {
    const token = randomBytes(32).toString("base64url");
    return { token, hash: hashVerificationToken(token) };
}
