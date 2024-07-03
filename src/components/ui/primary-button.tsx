import React from "react";

interface PrimaryButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  children,
  bgColor = "bg-blue-500",
  textColor = "text-white",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${textColor} rounded-full px-8 py-2 transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-sky-400 ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
