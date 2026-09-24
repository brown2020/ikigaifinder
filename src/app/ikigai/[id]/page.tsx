import type { Metadata } from "next";
import { getOptionalServerUid } from "@/lib/auth/session-server";
import { getIkigaiSummary, siteUrl } from "@/lib/ikigaiServer";
import ShareImagePage from "./_components/share-image-page";

type Props = { params: Promise<{ id: string }> };

export default async function IkigaiShare({ params }: Props) {
  const [{ id }, viewerUid] = await Promise.all([params, getOptionalServerUid()]);
  const isOwner = viewerUid === id;
  const summary = await getIkigaiSummary(id);
  const visible = isOwner || summary.sharable;

  return (
    <ShareImagePage
      userId={id}
      isOwner={isOwner}
      imageUrl={visible ? summary.coverImage : null}
      statement={visible ? summary.statement : null}
      keywords={visible ? summary.keywords : null}
      sharable={summary.sharable}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { sharable, coverImage, statement } = await getIkigaiSummary(id);
  const isPublic = sharable && Boolean(coverImage);

  const title = "An ikigai, found";
  const description = isPublic && statement ? statement : "Discover your own ikigai with Ikigai Finder.";
  const image = isPublic && coverImage ? coverImage : "/assets/ikigai-finder.webp";

  return {
    metadataBase: siteUrl(),
    title,
    description,
    robots: isPublic ? undefined : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `/ikigai/${id}`,
      siteName: "Ikigai Finder",
      type: "website",
      images: [{ url: image, width: 1080, height: 1080 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
