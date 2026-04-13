import React, { useEffect, useState } from "react";
import Image from "next/image";

import { db } from "@/firebase/firebaseClient";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useAuthStore, useIkigaiStore } from "@/zustand";

export default function ImageSelector() {
  const uid = useAuthStore((s) => s.uid);
  const fetchIkigaiData = useIkigaiStore((s) => s.ikigaiData);
  const updateIkigai = useIkigaiStore((s) => s.updateIkigai);
  const useImage = fetchIkigaiData?.ikigaiImage;
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  const defaultImage = "/assets/bg_image.webp";

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "ikigaiProfiles", uid, "covers"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const urls = snapshot.docs
          .map((doc) => doc.data().downloadUrl as string | undefined)
          .filter((url): url is string => Boolean(url));
        setFileUrls([...urls, defaultImage]);
      },
      () => {
        setFileUrls([defaultImage]);
      }
    );

    return () => unsubscribe();
  }, [uid, defaultImage]);

  const handleImageClick = (url: string) => {
    updateIkigai({ ikigaiImage: url });
  };

  return (
    <div className="flex overflow-x-auto p-2 space-x-3 bg-gray-200">
      {fileUrls.map((url, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleImageClick(url)}
          className={`shrink-0 rounded-md ring-4 focus-visible:outline-none focus-visible:ring-yellow-400 ${
            url === useImage ? "ring-yellow-500" : "ring-transparent"
          }`}
        >
          <Image
            src={url}
            alt={`Cover ${index}`}
            width={128}
            height={128}
            className="h-32 w-auto object-cover rounded-md"
          />
        </button>
      ))}
    </div>
  );
}
