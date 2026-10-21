import type { MetadataRoute } from "next";
import { absoluteSiteUrl, siteUrl } from "@/utils/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/generate-ikigai", "/profile", "/loginfinish", "/logout"],
      },
    ],
    sitemap: absoluteSiteUrl("/sitemap.xml"),
    host: siteUrl().origin,
  };
}
