import { useEffect, useRef } from "react";

/**
 * Custom hook for slide navigation using keyboard, mouse wheel, and touch
 * @param {number} currentSlide - Current active slide index
 * @param {number} totalSlides - Total number of slides
 * @param {boolean} isAnimating - Whether a slide transition is in progress
 * @param {Function} goToSlide - Function to navigate to a specific slide
 */
export default function useSlideNavigation(
  currentSlide,
  totalSlides,
  isAnimating,
  goToSlide
) {
  const touchStartY = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        if (currentSlide < totalSlides - 1) {
          goToSlide(currentSlide + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        if (currentSlide > 0) {
          goToSlide(currentSlide - 1);
        }
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      if (isAnimating) return;

      if (e.deltaY > 0) {
        if (currentSlide < totalSlides - 1) {
          goToSlide(currentSlide + 1);
        }
      } else if (e.deltaY < 0) {
        if (currentSlide > 0) {
          goToSlide(currentSlide - 1);
        }
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
          }
        } else {
          if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSlide, isAnimating, totalSlides, goToSlide]);

  return touchStartY;
}
