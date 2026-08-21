import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768) {
  // Initialize with false for SSR safety
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Run immediately on mount to get the actual width
    checkMobile();

    // Standard resize listener (works perfectly everywhere)
    window.addEventListener("resize", checkMobile);
    
    // iOS Safari specific: also check when the user rotates the phone
    window.addEventListener("orientationchange", () => {
      // Slight delay to let Safari finish calculating the new window width
      setTimeout(checkMobile, 50);
    });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
}