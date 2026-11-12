import "server-only";

import { v2 as cloudinary } from "cloudinary";
import { COVER_IMAGE_TYPE_ERROR, getCoverImageError } from "@/lib/events/cover-image-rules";

const COVER_FOLDER = "StackMeet";
const UPLOAD_PATH = "/image/upload/";

// The first bytes of every PNG and JPG file.
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPG_SIGNATURE = [0xff, 0xd8, 0xff];

// Checks a cover before it's uploaded: the type and size the browser reports, then the file's
// first bytes, because the reported type comes from the file name and a renamed file would pass.
// Returns an error message, or null when the image can be uploaded.
export async function checkCoverImage(file: File): Promise<string | null> {
    const error = getCoverImageError(file);
    if (error) return error;

    const start = new Uint8Array(await file.slice(0, PNG_SIGNATURE.length).arrayBuffer());
    const startsWith = (signature: number[]) => signature.every((byte, i) => start[i] === byte);
    return startsWith(PNG_SIGNATURE) || startsWith(JPG_SIGNATURE) ? null : COVER_IMAGE_TYPE_ERROR;
}

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
