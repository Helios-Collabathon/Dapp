import React from "react";
import classNames from "classnames";

interface SkeletonButtonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  className,
  width = "100px",
  height = "2.5em",
}) => {
  return (
    <div
      className={classNames("bg-gray-300 animate-pulse rounded-md", className)}
      style={{ width, height }}
    ></div>
  );
};
