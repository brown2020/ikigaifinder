"use client";
import GenerateIkigaiForm from "@/components/GenerateIkigaiForm";
import GenerateIkigaiImage from "@/components/GenerateIkigaiImage";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function GenerateIkigaiPageContent() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const [isSaveIkigai, setIsSaveIkigai] = useState(step === "image");

  return (
    <div>
      {isSaveIkigai ? (
        <GenerateIkigaiImage />
      ) : (
        <GenerateIkigaiForm setIsSaveIkigai={setIsSaveIkigai} />
      )}
    </div>
  );
}

function GenerateIkigaiPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateIkigaiPageContent />
    </Suspense>
  );
}

export default GenerateIkigaiPage;
