/**
 * Slide component for the History page presentation
 * @param {Object} props
 * @param {number} props.slideNumber - The slide number for styling
 * @param {string} props.title - The main title of the slide
 * @param {string} props.subtitle - The subtitle of the slide
 * @param {boolean} props.isActive - Whether this slide is currently active
 * @param {React.ReactNode} props.children - The slide content
 */
export default function Slide({
  slideNumber,
  title,
  subtitle,
  isActive,
  children,
}) {
  return (
    <div className={`slide slide-${slideNumber} ${isActive ? "active" : ""}`}>
      <div className="slide-content">
        <h1 className="slide-title">{title}</h1>
        <p className="slide-subtitle">{subtitle}</p>
        <div className="slide-description">{children}</div>
      </div>
    </div>
  );
}
