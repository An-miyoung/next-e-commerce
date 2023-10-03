import React from "react";
import StarIcon from "../ui/StarIcon";

interface Props {
  value: number;
}

export default function Rating({ value }: Props) {
  const data = Array(5).fill("");
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars >= 0.1;

  return (
    <div className=" flex items-center space-x-0.5">
      {data.map((_, index) => {
        return index + 1 <= fullStars ? (
          <StarIcon.Full key={index} />
        ) : halfStars && index === fullStars ? (
          <StarIcon.Half key={index} />
        ) : (
          <StarIcon.Empty key={index} />
        );
      })}
      <span className=" font-semibold text-sm">{value}</span>
    </div>
  );
}
