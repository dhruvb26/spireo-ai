import React, { ButtonHTMLAttributes } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  gradientColors?: [string, string, string];
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  className = "",
  gradientColors = ["from-blue-400", "via-blue-700", "to-blue-950"],
  ...props
}) => {
  const gradientClasses = `bg-gradient-to-r ${gradientColors.join(" ")}`;

  return (
    <button
      className={`inline-flex h-12 items-center justify-end rounded-full px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${gradientClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
