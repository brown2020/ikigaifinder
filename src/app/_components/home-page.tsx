import HomeHeroSection from "@/components/HomeHeroSection";
import IkigaiExplainer from "@/components/IkigaiExplainer";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FinalCta from "@/components/FinalCta";

export default function HomePage(): React.ReactElement {
  return (
    <div>
      <div id="home-hero">
        <HomeHeroSection />
      </div>
      <HowItWorks />
      <Features />
      <div className="md:px-10 p-5 py-8">
        <IkigaiExplainer />
      </div>
      <Testimonials />
      <FinalCta />
    </div>
  );
}


