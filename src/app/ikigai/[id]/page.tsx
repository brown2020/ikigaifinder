import ShareImagePage from "./_components/share-image-page";
import { adminDb } from "@/firebase/firebaseAdmin";
import { getOptionalServerUid } from "@/lib/auth/session-server";
import { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export default async function IkigaiShare({ params }: Props) {
  const { id } = await params;

  const viewerUid = await getOptionalServerUid();
  const isOwner = Boolean(viewerUid && viewerUid === id);

  let imageUrl: string | null = null;
  let sharableUrl = false;

  try {
    const docRef = adminDb
      .collection("ikigaiUsers")
      .doc(id)
      .collection("ikigai")
      .doc("main");
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      imageUrl = (data?.ikigaiCoverImage as string | undefined) ?? null;
      sharableUrl = Boolean(data?.ikigaiSharableUrl);
    }
  } catch {
    // fall through to restricted/default view
  }

  // Never leak non-sharable image URLs to non-owners.
  const initialImageUrl = isOwner || sharableUrl ? imageUrl : null;

  return (
    <ShareImagePage
      userId={id}
      viewerUid={viewerUid}
      initialImageUrl={initialImageUrl}
      initialSharableUrl={sharableUrl}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: userId } = await params;

  let imageUrl = "";
  let sharableUrl = false;

  try {
    const docRef = adminDb
      .collection("ikigaiUsers")
      .doc(userId)
      .collection("ikigai")
      .doc("main");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      imageUrl = data?.ikigaiCoverImage || "";
      sharableUrl = data?.ikigaiSharableUrl || false;
    }
  } catch {
    // fall back to default social image
  }

  const shareUrl =
    sharableUrl && imageUrl ? imageUrl : "https://assets/falcon.jpeg";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "https://ikigaifinder.ai"
    ),
    title: "Check out my Ikigai!",
    description: "I just created my Ikigai with Ikigaifinder.ai/",

    openGraph: {
      title: "Check out my Ikigai!",
      description: "I just created my Ikigai with Ikigaifinder.ai/",
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://ikigaifinder.ai"
      }/ikigai/${userId}`,
      siteName: "Ikigaifinder.ai/",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: shareUrl,
          width: 512,
          height: 512,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Check out my Ikigai!",
      description: "I just created my Ikigai with Ikigaifinder.ai/",
      images: [shareUrl],
    },
  };
}
