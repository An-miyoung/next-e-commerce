"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ViewSource from "./ViewSource";

interface Props {
  images: string[];
}

const settings: Settings = {
  dots: false,
  lazyLoad: "anticipated",
  infinite: true,
  speed: 100,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
  className: "w-[150px]",
};

// Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export const Color = () => (
  <div>
    <ViewSource pathname="pages/color.tsx" />
    <h1>Image Component With Color Data URL</h1>
    <Image
      alt="Dog"
      src="/dog.jpg"
      placeholder="blur"
      blurDataURL={rgbDataURL(237, 181, 6)}
      width={750}
      height={1000}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
    <Image
      alt="Cat"
      src="/cat.jpg"
      placeholder="blur"
      blurDataURL={rgbDataURL(2, 129, 210)}
      width={750}
      height={1000}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  </div>
);

export default function ProductImageGallery(props: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { images } = props;
  const slider = useRef<Slider>(null);

  return (
    <div>
      <Slider
        {...settings}
        afterChange={(currentSlide) => {
          setCurrentSlide(currentSlide);
        }}
        ref={slider}
      >
        {images.map((img, index) => {
          return (
            <Image
              key={index}
              src={img}
              alt="testing"
              width={300}
              height={300}
              placeholder="blur"
              blurDataURL={rgbDataURL(237, 181, 6)}
            />
          );
        })}
      </Slider>
      <div className="flex py-2 space-x-2">
        {images.map((img, index) => {
          return (
            <Image
              onClick={() => slider.current?.slickGoTo(index)}
              className={index === currentSlide ? "ring ring-black" : ""}
              key={index}
              src={img}
              alt="testing"
              width={80}
              height={80}
            />
          );
        })}
      </div>
      <div className="h-20" />
    </div>
  );
}
