"use client";
import React, { useState } from "react";
import HomeHeroSection from "@/components/HomeHeroSection";
import { Heart, Medal, PencilRuler, Rocket, Target } from "lucide-react";
import RenderIkigaiDetails from "@/components/RenderIkigaiDetails";
import DemoImageSlick from "@/components/DemoImageSlick";
import AuthComponent from "@/components/AuthComponent";

export default function Homepage() {

  const [isOpenAuthModal, setIsOpenAuthModal] = useState<boolean>(false);

  const handleOpenAuthModal = () => setIsOpenAuthModal(!isOpenAuthModal);
  return (
    <div>
      <div id="home-hero">
        <HomeHeroSection handleOpenAuthModal={handleOpenAuthModal} />
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 md:px-10 p-5 py-8">
        <div className="flex justify-center items-start">
          <div className="w-full max-w-lg sticky top-8">
            <DemoImageSlick />
          </div>
        </div>
        <div className="">
          <RenderIkigaiDetails
            Icon={Target}
            title={"What is Ikigai?"}
            description={
              'Ikigai is a Japanese concept that translates to "a reason for being." It represents the intersection of what you love, what you are good at, what you can be paid for, and what the world needs. Discovering your ikigai can lead to a fulfilling and purposeful life, guiding you toward a career and lifestyle that resonate deeply with your values and passions.'
            }
            color={"#9B59B6"}
          />

          <RenderIkigaiDetails
            Icon={Heart}
            title={"What You Love"}
            description={
              "This is about identifying your passions and interests activities that excite and inspire you. Consider what brings you joy and fulfillment. This could range from hobbies to topics you can’t stop talking about. Recognizing what you love helps to spark motivation and enthusiasm in your journey toward finding your ikigai."
            }
            color={"#fe7288"}
          />
          <RenderIkigaiDetails
            Icon={Medal}
            title={"What You Are Good At"}
            description={
              "Understanding your strengths is crucial. This involves recognizing your skills, talents, and capabilities both innate and developed over time. Reflect on what you excel at and seek feedback from others. Knowing what you are good at allows you to leverage your unique abilities as you explore career paths that align with your ikigai."
            }
            color={"#6187c5"}
          />
          <RenderIkigaiDetails
            Icon={PencilRuler}
            title={"What You Can Be Paid For"}
            description={
              "This point focuses on the practical aspect of your ikigai—identifying professions or roles that can provide financial stability. Consider careers or services that not only match your skills and passions but also offer monetary rewards. Understanding the market demand for your skills helps in aligning your passion with a sustainable livelihood."
            }
            color={"#68cac7"}
          />

          <RenderIkigaiDetails
            Icon={Rocket}
            title={"What the World Needs"}
            description={
              "This aspect encourages you to think about the broader impact of your work. What issues or challenges resonate with you? What contributions can you make to society? By identifying what the world needs, you can align your passions and skills with a purpose that serves others, creating a sense of fulfillment and meaning in your life."
            }
            color={"#f9c93e"}
          />
        </div>
      </div>

      {isOpenAuthModal && (
        <AuthComponent isOpenModal={isOpenAuthModal} onCloseModal={() => setIsOpenAuthModal(false)} />
      )}
    </div>
  );
}
