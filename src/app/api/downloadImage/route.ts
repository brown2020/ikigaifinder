import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// Types
// ============================================================================

interface ErrorResponse {
  error: string;
}

// ============================================================================
// Configuration
// ============================================================================

/** Allowed domains for image downloads */
const ALLOWED_DOMAINS = [
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
];

/** Maximum file size (10MB) */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ============================================================================
// Utilities
// ============================================================================

/**
 * Validate that the URL is from an allowed domain
 */
function isAllowedDomain(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_DOMAINS.some(
      (domain) =>
        parsedUrl.hostname === domain ||
        parsedUrl.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Create a JSON error response
 */
function errorResponse(message: string, status: number): NextResponse<ErrorResponse> {
  return NextResponse.json({ error: message }, { status });
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * GET /api/downloadImage
 * 
 * Proxies image downloads from allowed domains (Firebase Storage)
 * to avoid CORS issues when downloading user-generated images.
 * 
 * Query Parameters:
 * - url: The image URL to download
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  // Validate URL parameter
  if (!imageUrl) {
    return errorResponse("URL parameter is required", 400);
  }

  // Validate domain
  if (!isAllowedDomain(imageUrl)) {
    return errorResponse("Image URL domain not allowed", 403);
  }

  try {
    // Fetch the image
    const response = await fetch(imageUrl, {
      headers: {
        // Add cache control for better performance
        "Cache-Control": "public, max-age=31536000",
      },
    });

    if (!response.ok) {
      return errorResponse(
        `Failed to fetch image: ${response.statusText}`,
        response.status
      );
    }

    // Check content length
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE) {
      return errorResponse("Image file too large", 413);
    }

    // Get the image data
    const arrayBuffer = await response.arrayBuffer();

    // Determine content type
    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream";

    // Validate content type is an image
    if (!contentType.startsWith("image/")) {
      return errorResponse("URL does not point to an image", 400);
    }

    // Return the image with appropriate headers
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": 'attachment; filename="ikigai-image.png"',
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    return errorResponse("Internal server error", 500);
  }
}
