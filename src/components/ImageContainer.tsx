import React from "react";
import { twMerge } from "tailwind-merge";

export const Figure = ({ children }: { children: React.ReactNode }) => {
  return (
    <figure className="text-center">
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement<{ className: string }>(child) &&
          typeof child.type !== "string"
        ) {
          // Clone the child and merge className
          return React.cloneElement(child, {
            className: twMerge(
              (child.props as { className?: string }).className,
              "w-full text-center",
            ),
          });
        }
        return child; // Return unmodified if it's a string or other primitive
      })}
    </figure>
  );
};

export const ImageContainer = ({
  columns = 1,
  className,
  children,
}: {
  columns?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const columnVariants = [
    "grid-cols-0",
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-7",
    "grid-cols-8",
  ];

  return (
    <div
      className={twMerge(
        `grid ${columnVariants[columns]} gap-4 items-center justify-center w-full max-w-[90%] mx-auto py-4 ${className} `,
      )}
    >
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement<{ className: string }>(child) &&
          typeof child.type !== "string"
        ) {
          // Clone the child and merge className
          return React.cloneElement(child, {
            className: twMerge(
              (child.props as { className?: string }).className,
              "w-full",
            ),
          });
        }
        return child; // Return unmodified if it's a string or other primitive
      })}
    </div>
  );
};
