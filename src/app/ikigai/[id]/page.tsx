import ShareImagePage from "./_components/share-image-page";
import { adminDb } from "@/firebase/firebaseAdmin";
import { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export default async function IkigaiShare({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <ShareImagePage userId={id} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const userId = resolvedParams.id;

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
    } else {
      console.log("No such document!");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error getting document:", error.message);
    } else {
      console.log("An unknown error occurred while getting the document.");
    }
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
