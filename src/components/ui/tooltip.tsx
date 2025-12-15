import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip = ({ content, children, className }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
  };

  React.useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible]);

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => {
        updatePosition();
        setIsVisible(true);
      }}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{
                opacity: 0,
                x: "-50%",
                y: "-100%",
                marginTop: 5,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                x: "-50%",
                y: "-100%",
                marginTop: -8,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: "-50%",
                y: "-100%",
                marginTop: 5,
                scale: 0.95,
              }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                zIndex: 9999,
              }}
              className={cn(
                "px-4 py-2.5 text-xs text-white bg-black rounded-md whitespace-nowrap shadow-md pointer-events-none",
                className
              )}
            >
              {content}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
