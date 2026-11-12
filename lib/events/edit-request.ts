import type { NextRequest } from "next/server";

type EditRequest =
    | { fields: unknown; image: File | null; error?: never }
    | { fields?: never; image?: never; error: string };

// Form data sends these as JSON strings, the same way the create form does.
const JSON_FIELDS = ["tags", "agenda"];

// Reads a PATCH body. JSON changes fields only. Form data can also carry a new cover image.
export async function readEditRequest(request: NextRequest): Promise<EditRequest> {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.startsWith("multipart/form-data")) {
        try {
            return fromFormData(await request.formData());
        } catch {
            return { error: "The request body must be valid form data." };
        }
    }

    try {
        return { fields: await request.json(), image: null };
    } catch {
        return { error: "The request body must be valid JSON." };
    }
}

function fromFormData(formData: FormData): EditRequest {
    const fields: Record<string, unknown> = {};
    let image: File | null = null;

    for (const [key, value] of formData.entries()) {
        if (key === "image") {
            // An empty file input still sends a file with no content. That, or a text value,
            // means "keep the current image".
            if (value instanceof File && value.size > 0) image = value;
            continue;
        }

        if (typeof value !== "string") return { error: `${key} must be text.` };

        if (!JSON_FIELDS.includes(key)) {
            fields[key] = value;
            continue;
        }

        try {
            fields[key] = JSON.parse(value);
        } catch {
            return { error: `${key} must be valid JSON.` };
        }
    }

    return { fields, image };
}
