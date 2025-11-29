import { generateText, type FilePart, type TextPart } from "ai";
import { createErrorResponse } from "../../../lib/request-utils";

type FileInput = {
    url: string;
    mediaType: string;
    filename?: string;
};

/**
 * POST handler for ai-elements-image
 *
 * Note: Rate limiting is handled at the route wrapper level
 * See: app/(view)/view/[name]/api/[...slug]/route.ts
 */
export async function POST(req: Request) {
    try {
        const { prompt, files }: { prompt: string; files?: FileInput[] } =
            await req.json();

        // Build message parts: images first, then text prompt
        const messageParts: (FilePart | TextPart)[] = [];

        // Add attached images as file parts
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.url && file.mediaType?.startsWith("image/")) {
                    // Handle both data URLs and blob URLs
                    if (file.url.startsWith("data:")) {
                        // Extract base64 from data URL
                        const base64Match = file.url.match(/^data:[^;]+;base64,(.+)$/);
                        if (base64Match) {
                            messageParts.push({
                                type: "file",
                                data: base64Match[1],
                                mediaType: file.mediaType as
                                    | "image/jpeg"
                                    | "image/png"
                                    | "image/gif"
                                    | "image/webp",
                            });
                        }
                    } else {
                        // For regular URLs, use the URL directly
                        messageParts.push({
                            type: "file",
                            data: new URL(file.url),
                            mediaType: file.mediaType as
                                | "image/jpeg"
                                | "image/png"
                                | "image/gif"
                                | "image/webp",
                        });
                    }
                }
            }
        }

        // Add text prompt
        messageParts.push({
            type: "text",
            text: prompt,
        });

        const result = await generateText({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
                {
                    role: "user",
                    content: messageParts,
                },
            ],
            system: "Generate bold, high-contrast YouTube thumbnails with minimal text, clear focal subjects, vibrant colors, and strong visual hierarchy. Ensure the design is eye-catching, readable at small sizes, and aligned with the video’s theme.",
        });

        for (const file of result.files) {
            if (file.mediaType.startsWith("image/")) {
                return Response.json({ imageUrl: file.base64 });
            }
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return createErrorResponse(error);
    }
}
