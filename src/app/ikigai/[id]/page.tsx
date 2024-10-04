import ShareImagePage from "@/componentPages/ShareImagePage";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import { db } from "@/firebase/firebaseClient";

type Props = { params: { id: string } };

export default function IkigaiShare({ params: { id } }: Props) {
  return <ShareImagePage userId={id}  />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const userId = params.id;
  let imageUrl: string = "";
  let sharableUrl: boolean = false;

  const fetchImageUrl = async () => {
    try {
      const docRef = doc(db, ` ikigaiUsers/${userId}/ikigai/main`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        imageUrl = docSnap.data().ikigaiCoverImage;
        sharableUrl = docSnap.data().ikigaiSharableUrl;
      } else {
        console.log("No such document!");
        imageUrl = "";
        sharableUrl = false;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error getting document:", error.message);
      } else {
        console.log("An unknown error occurred while getting the document.");
      }
      imageUrl = "";
      sharableUrl = false;
    } finally {
      if (sharableUrl && imageUrl) return imageUrl;
      return "https://assets/falcon.jpeg";
    }
  };

  const shareUrl = await fetchImageUrl();

  return {
    metadataBase: new URL("https://Ikigaifinder.ai/"),
    title: "Check out my Ikigai!",
    description: "I just created my Ikigai with Ikigaifinder.ai/",

    openGraph: {
      title: "Check out my ikigai!",
      description: "I just created my ikigai with Ikigaifinder.ai/",
      url: `https://Ikigaifinder.ai//ikigai/${userId}`,
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
      title: "Check out my ikigai!",
      description: "I just created my ikigai with Ikigaifinder.ai/",
      images: [shareUrl],
    },
  };
}
