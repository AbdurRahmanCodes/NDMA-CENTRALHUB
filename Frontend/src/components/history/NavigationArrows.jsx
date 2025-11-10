/**
 * NavigationArrows component - displays up/down navigation arrows
 * @param {Object} props
 * @param {number} props.currentSlide - Current active slide index
 * @param {number} props.totalSlides - Total number of slides
 * @param {Function} props.onNext - Callback for next slide
 * @param {Function} props.onPrev - Callback for previous slide
 */
export default function NavigationArrows({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
}) {
  return (
    <>
      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <button className="nav-arrow nav-arrow-up" onClick={onPrev}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}
      {currentSlide < totalSlides - 1 && (
        <button className="nav-arrow nav-arrow-down" onClick={onNext}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}
    </>
  );
}
