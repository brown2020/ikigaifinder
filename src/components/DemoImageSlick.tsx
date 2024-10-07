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
    autoplaySpeed: 2000,
    speed: 1500,
    pauseOnHover: true,
  };

  const imagePath = [
    "/assets/image.png",
    "/assets/image1.png",
    "/assets/image2.png",
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
