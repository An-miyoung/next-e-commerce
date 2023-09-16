"use Client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface props {
  errorMessage: string;
}

const ErrorRender: React.FC<props> = ({ errorMessage }) => {
  return <p className="text-xs px-3">{errorMessage}</p>;
};

export default ErrorRender;
