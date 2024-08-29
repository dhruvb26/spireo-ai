import React from "react";

interface CommentIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const CommentIcon: React.FC<CommentIconProps> = ({
  width = 24,
  height = 24,
  color = "#667085",
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={color}
      className={className}
    >
      <path d="M7 9h10v1H7zm0 4h7v-1H7zm16-2a6.78 6.78 0 01-2.84 5.61L12 22v-4H8A7 7 0 018 4h8a7 7 0 017 7zm-2 0a5 5 0 00-5-5H8a5 5 0 000 10h6v2.28L19 15a4.79 4.79 0 002-4z" />
    </svg>
  );
};

export default CommentIcon;
