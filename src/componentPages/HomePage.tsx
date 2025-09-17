"use client";
import React, { useState } from "react";
import HomeHeroSection from "@/components/HomeHeroSection";
import IkigaiExplainer from "@/components/IkigaiExplainer";
import AuthComponent from "@/components/AuthComponent";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FinalCta from "@/components/FinalCta";

export default function Homepage() {
  const [isOpenAuthModal, setIsOpenAuthModal] = useState<boolean>(false);

  const handleOpenAuthModal = () => setIsOpenAuthModal(!isOpenAuthModal);
  return (
    <div>
      <div id="home-hero">
        <HomeHeroSection handleOpenAuthModal={handleOpenAuthModal} />
      </div>
      <HowItWorks />
      <Features />
      <div className="md:px-10 p-5 py-8">
        <IkigaiExplainer />
      </div>
      <Testimonials />
      <FinalCta />

      {isOpenAuthModal && (
        <AuthComponent
          isOpenModal={isOpenAuthModal}
          onCloseModal={() => setIsOpenAuthModal(false)}
        />
      )}
    </div>
  );
}
