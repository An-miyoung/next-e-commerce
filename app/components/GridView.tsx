import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GridView = ({ children }: Props) => {
  return <div className="grid grid-cols-3 gap-4">{children}</div>;
};

export default GridView;
