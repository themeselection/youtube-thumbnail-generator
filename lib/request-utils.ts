export function createErrorResponse(
    error: unknown,
    options: {
        includeDetails?: boolean;
        customMessage?: string;
        status?: number;
    } = {}
): Response {
    const {
        includeDetails = process.env.NODE_ENV === "development",
        customMessage = "Internal server error. Please try again later.",
        status = 500,
    } = options;

    const errorMessage = error instanceof Error ? error.message : String(error);

    return new Response(
        JSON.stringify({
            error: customMessage,
            type: "internal_error",
            ...(includeDetails && { details: errorMessage }),
        }),
        {
            status,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

/**
 * Creates a standardized success response with optional data
 *
 * @param data - The data to return
 * @param options - Optional configuration for the response
 * @returns Next.js Response object with proper formatting
 *
 * @example
 * ```typescript
 * return createSuccessResponse({ message: "Success!" });
 *
 * // With custom status
 * return createSuccessResponse(data, { status: 201 });
 * ```
 */
export function createSuccessResponse(
    data: unknown,
    options: {
        status?: number;
        headers?: Record<string, string>;
    } = {}
): Response {
    const { status = 200, headers = {} } = options;

    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
}
