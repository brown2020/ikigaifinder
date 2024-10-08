"use client";
import Image from "next/image";
import Slider from "react-slick";

export default function DemoImageSlick() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 2000,
    pauseOnHover: true,
  };

  const imagePath = [
    "/assets/demoImages/image1.webp",
    "/assets/demoImages/image2.webp",
    "/assets/demoImages/image3.webp",
    "/assets/demoImages/image4.webp",
    "/assets/demoImages/image5.webp",
    "/assets/demoImages/image6.webp",
  ];
  return (
    <Slider {...settings}>
      {imagePath?.length > 0
        ? imagePath?.map((image) => {
            return (
              <div    key={image} className="p-2">
                <Image
                  key={image}
                  src={image}
                  alt="demo image"
                  width={300}
                  height={300}
                  unoptimized
                  className="w-full h-full"
                />
              </div>
            );
          })
        : null}
    </Slider>
  );
}
