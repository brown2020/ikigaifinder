"use client";
import GenerateIkigaiForm from "@/components/GenerateIkigaiForm";
import GenerateIkigaiImage from "@/components/GenerateIkigaiImage";
import withAuth from "@/components/withAuth";
import { useState } from "react";

function GenerateIkigaiPage() {
  const [isSaveIkigai, setIsSaveIkigai] = useState(false);
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

export default  withAuth(GenerateIkigaiPage)
