import ShareImagePage from "@/componentPages/ShareImagePage";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import { db } from "@/firebase/firebaseClient";

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
    const docRef = doc(db, `ikigaiUsers/${userId}/ikigai/main`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      imageUrl = docSnap.data().ikigaiCoverImage || "";
      sharableUrl = docSnap.data().ikigaiSharableUrl || false;
    } else {
      console.log("No such document!");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error getting document:", error.message);
    } else {
      console.error("An unknown error occurred while getting the document.");
    }
  }

  const shareUrl =
    sharableUrl && imageUrl ? imageUrl : "https://assets/falcon.jpeg";

  return {
    metadataBase: new URL("https://ikigaifinder.ai/"),
    title: "Check out my Ikigai!",
    description: "I just created my Ikigai with Ikigaifinder.ai/",

    openGraph: {
      title: "Check out my Ikigai!",
      description: "I just created my Ikigai with Ikigaifinder.ai/",
      url: `https://ikigaifinder.ai/ikigai/${userId}`,
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
