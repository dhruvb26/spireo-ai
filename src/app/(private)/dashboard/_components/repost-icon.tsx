import React from "react";

interface RepostIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const RepostIcon: React.FC<RepostIconProps> = ({
  width = 18,
  height = 18,
  color = "#667085",
  className = "",
}) => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={`${width}pt`}
      height={`${height}pt`}
      viewBox="0 0 96.000000 96.000000"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <g
        transform="translate(96,0) rotate(90) translate(0.000000,96.000000) scale(0.100000,-0.100000)"
        fill={color}
        stroke="none"
      >
        <path d="M70 720 l-70 -70 0 -80 70 70 70 70 0 -250 c0 -330 -7 -320 330 -320 l220 0 0 40 0 30 -225 0 c-296 0 -270 -25 -270 268 l0 252 70 -70 70 -70 0 80 -70 70 c-38 38 -72 70 -85 80 - 0 -50 -35 -90 -70z" />
        <path d="M890 240 l70 70 0 80 -70 -70 -70 -70 0 250 c0 330 7 320 -330 320 l-220 0 0 -40 0 -30 225 0 c296 0 270 25 270 -268 l0 -252 -70 70 -70 70 0 -80 70 -70 c38 -38 72 -70 85 -80 0 50 35 90 70z" />
      </g>
    </svg>
  );
};

export default RepostIcon;
