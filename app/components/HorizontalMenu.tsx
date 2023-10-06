"use client";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useContext } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";

interface Props {
  children: JSX.Element | JSX.Element[];
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <button
      className="px-2 transition"
      disabled={isFirstItemVisible}
      style={{ opacity: isFirstItemVisible ? "0" : "1" }}
      onClick={() => scrollPrev()}
    >
      <ChevronLeftIcon className="w-4 h-4" />
    </button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <button
      className="px-2 transition"
      style={{ opacity: isLastItemVisible ? "0" : "1" }}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    >
      <ChevronRightIcon className="w-4 h-4" />
    </button>
  );
}

export default function HorizontalMenu({ children }: Props) {
  return (
    <div>
      <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
        {children}
      </ScrollMenu>
    </div>
  );
}

// /* chrome and chromium based */
// .react-horizontal-scrolling-menu--scroll-container::-webkit-scrollbar {
//     display: none;
//   }

//   .react-horizontal-scrolling-menu--scroll-container {
//     -ms-overflow-style: none; /* IE and Edge */
//     scrollbar-width: none; /* Firefox */
//   }
