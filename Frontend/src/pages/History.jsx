import { useState, useCallback, useEffect, useRef } from "react";
import "./History.css";
import useSlideNavigation from "../hooks/useSlideNavigation";
import SlideIndicator from "../components/history/SlideIndicator";
import NavigationArrows from "../components/history/NavigationArrows";
import { slidesData } from "../data/slidesData";
import Slide from "../components/history/Slide";

export default function History() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const glowRef = useRef(null);
  const totalSlides = slidesData.length;

  const goToSlide = useCallback(
    (slideIndex) => {
      if (isAnimating || slideIndex < 0 || slideIndex >= totalSlides) return;

      setIsAnimating(true);
      setCurrentSlide(slideIndex);

      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    },
    [isAnimating, totalSlides]
  );

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  // Mouse glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Use custom hook for keyboard, wheel, and touch navigation
  useSlideNavigation(currentSlide, totalSlides, isAnimating, goToSlide);

  return (
    <div className="history-page">
      {/* Mouse Glow Effect */}
      <div
        ref={glowRef}
        className="mouse-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      ></div>

      <div
        className="slides-container"
        style={{
          transform: `translateY(calc(-${currentSlide} * (100vh - 126.11px)))`,
        }}
      >
        {slidesData.map((slide) => (
          <Slide
            key={slide.id}
            slideNumber={slide.id}
            title={slide.title}
            subtitle={slide.subtitle}
            isActive={currentSlide === slide.id - 1}
          >
            {slide.content}
          </Slide>
        ))}
      </div>

      <SlideIndicator
        totalSlides={totalSlides}
        currentSlide={currentSlide}
        onSlideChange={goToSlide}
      />

      <NavigationArrows
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onNext={nextSlide}
        onPrev={prevSlide}
      />
    </div>
  );
}
