import Image from "next/image";
import StepperForm from "@/components/StepperForm";

export default function IkigaiPage() {
  return (
    <div className="relative">
      <Image
        src="/assets/ikigai-finder.webp"
        alt="Ikigai Finder"
        width={1000}
        height={1000}
        className="w-full h-full object-cover absolute top-0 left-0 -z-20 brightness-50"
      />
      <div className="flex flex-col gap-5 text-white px-10 pt-24 pb-10">
        <StepperForm />
      </div>
    </div>
  );
}
