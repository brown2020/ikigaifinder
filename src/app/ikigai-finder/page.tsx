import IkigaiStepperForm from "@/components/IkigaiStepperForm";
import { Section } from "@/components/ui";

export default function IkigaiFinderPage() {
  return (
    <Section containerClassName="py-6" size="lg" padding="none">
      <div className="flex flex-col gap-5">
        <IkigaiStepperForm />
      </div>
    </Section>
  );
}
