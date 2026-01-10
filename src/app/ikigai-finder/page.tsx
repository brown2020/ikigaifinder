import IkigaiStepperForm from "@/components/IkigaiStepperForm";
import { Section } from "@/components/ui";

export default function IkigaiFinderPage() {
  return (
    <Section className="bg-background" containerClassName="py-6" size="lg" padding="none">
      <div className="flex flex-col gap-5">
        <IkigaiStepperForm />
      </div>
    </Section>
  );
}
