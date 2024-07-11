import React, { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface CoolModeProps {
  children: React.ReactElement;
  duration?: number;
  particleCount?: number;
  spread?: number;
  colors?: string[];
}

export const CoolMode: React.FC<CoolModeProps> = ({
  children,
  duration = 15000,
  particleCount = 100,
  spread = 360,
  colors,
}) => {
  const buttonRef = useRef<HTMLElement>(null);

  const fireConfetti = useCallback(() => {
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount,
        spread: spread,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: colors,
        startVelocity: 50,
        disableForReducedMotion: true,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [duration, particleCount, spread, colors]);

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      button.addEventListener("click", fireConfetti);
      return () => {
        button.removeEventListener("click", fireConfetti);
      };
    }
  }, [fireConfetti]);

  return React.cloneElement(children, { ref: buttonRef });
};
