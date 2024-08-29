import React from "react";

interface SendIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const SendIcon: React.FC<SendIconProps> = ({
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
      <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z" />
    </svg>
  );
};

export default SendIcon;
