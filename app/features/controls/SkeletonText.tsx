import React from "react";
import classNames from "classnames";

interface SkeletonTextProps {
  className?: string;
  width?: string;
  height?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  className,
  width = "100%",
  height = "1em",
}) => {
  return (
    <div
      className={classNames("bg-gray-300 animate-pulse", className)}
      style={{ width, height }}
    ></div>
  );
};
