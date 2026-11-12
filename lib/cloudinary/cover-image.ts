import "server-only";

import { v2 as cloudinary } from "cloudinary";

const COVER_FOLDER = "StackMeet";
const UPLOAD_PATH = "/image/upload/";

// Uploads a cover image and returns its URL.
export async function uploadCoverImage(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ resource_type: "image", folder: COVER_FOLDER }, (error, result) => {
                if (error) return reject(error);
                if (!result?.secure_url) return reject(new Error("Cloudinary upload failed"));
                resolve(result.secure_url);
            })
            .end(buffer);
    });
}

// "https://res.cloudinary.com/<cloud>/image/upload/v123/StackMeet/abc.jpg" → "StackMeet/abc".
// null for anything that isn't one of our uploaded covers, so sample images are never deleted.
export function getCoverImagePublicId(url: string): string | null {
    if (!url.startsWith("https://res.cloudinary.com/")) return null;

    const start = url.indexOf(UPLOAD_PATH);
    if (start === -1) return null;

    const publicId = url
        .slice(start + UPLOAD_PATH.length)
        .replace(/^v\d+\//, "")
        .replace(/\.[^./]+$/, "");

    return publicId.startsWith(`${COVER_FOLDER}/`) ? publicId : null;
}

export async function deleteCoverImage(url: string): Promise<void> {
    const publicId = getCoverImagePublicId(url);
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
