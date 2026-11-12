// The cover image rules, shared by the create form and the server, so both check the same thing.

const COVER_IMAGE_TYPES = ["image/png", "image/jpeg"];
const MAX_COVER_IMAGE_MB = 5;

// For the file input's `accept`, so the picker offers only these types.
export const COVER_IMAGE_ACCEPT = COVER_IMAGE_TYPES.join(",");

export const COVER_IMAGE_TYPE_ERROR = "Choose a PNG or JPG image.";
const COVER_IMAGE_SIZE_ERROR = `The image you uploaded exceeds the maximum size. Please choose an image up to ${MAX_COVER_IMAGE_MB} MB.`;

// The type here comes from the browser, based on the file name. The server also checks the file's content.
export function getCoverImageError({ type, size }: { type: string; size: number }): string | null {
    if (!COVER_IMAGE_TYPES.includes(type)) return COVER_IMAGE_TYPE_ERROR;
    if (size > MAX_COVER_IMAGE_MB * 1024 * 1024) return COVER_IMAGE_SIZE_ERROR;
    return null;
}
