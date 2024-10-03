import Image from "next/image";
import IkigaiStepperForm from "@/components/IkigaiStepperForm";

export default function IkigaiPage() {
  return (
    <div className="relative">
      <Image
        src="/assets/ikigai-finder.webp"
        alt="Ikigai Finder"
        width={375}
        height={375}
        className="w-full h-full object-cover absolute top-0 left-0 -z-20 brightness-50"
      />
      <div className="flex flex-col gap-5 text-white md:p-10 p-5">
        <IkigaiStepperForm />
      </div>
    </div>
  );
}
