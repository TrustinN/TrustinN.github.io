import React from "react";
import { twMerge } from "tailwind-merge";

export const Float = ({
  direction = "right",
  className,
  children,
}: {
  direction?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const dirVariants: Record<string, string> = {
    right: "float-right",
    left: "float-left",
  };

  return (
    <div className={twMerge(`${dirVariants[direction]} m-4 ${className}`)}>
      {children}
    </div>
  );
};
