/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

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

  const defaultImage = "/assets/bg_image.webp"

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "ikigaiProfiles", uid, "covers"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const urls = snapshot.docs
        .map((doc) => doc.data().downloadUrl)
        .filter(Boolean);
      setFileUrls([...urls, defaultImage]);
      console.log("urls :>> ", urls);
    });

    return () => unsubscribe();
  }, [uid]);

  const handleImageClick = (url: string) => {
    updateIkigai({ ikigaiImage: url });
  };

  return (
    <div className="flex overflow-x-auto p-2 space-x-3 bg-gray-200">
      {fileUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Cover ${index}`}
          onClick={() => handleImageClick(url)}
          className={`h-32 object-cover rounded-md cursor-pointer ring-4
                          ${
                            url === useImage
                              ? "ring-yellow-500"
                              : "ring-transparent"
                          }`}
        />
      ))}
    </div>
  );
}
