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
    const upstream = await fetch(imageUrl);
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch image" }), {
        status: upstream.status,
      });
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";
    const arrayBuffer = await upstream.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.log("Error downloading image:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
