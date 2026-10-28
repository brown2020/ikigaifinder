import { headers } from "next/headers";
import { jsonLdScript } from "@/utils/siteUrl";

/** JSON-LD with the request nonce so a strict script-src can allow it. */
export default async function JsonLd({ data }: { data: unknown }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }} />;
}
