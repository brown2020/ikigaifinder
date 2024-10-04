import fetch from "node-fetch";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new Response(
      JSON.stringify({ error: "URL parameter is required" }),
      { status: 400 }
    );
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch image" }), {
        status: response.status,
      });
    }

    const imageBuffer = await response.buffer();
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
