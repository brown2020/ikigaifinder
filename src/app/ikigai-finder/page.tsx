// import Image from "next/image";
import IkigaiStepperForm from "@/components/IkigaiStepperForm";

export default function IkigaiPage() {
  return (
    <div className="relative">
      <div className="flex flex-col gap-5 text-white p-10">
        <IkigaiStepperForm />
      </div>
    </div>
  );
}
