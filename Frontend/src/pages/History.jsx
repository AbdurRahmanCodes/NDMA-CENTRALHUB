import { useState, useCallback, useEffect, useRef } from "react";
import "./History.css";
import useSlideNavigation from "../hooks/useSlideNavigation";
import SlideIndicator from "../components/history/SlideIndicator";
import slide3Chart from "../assets/history/chart.png";
// import NavigationArrows from "../components/history/NavigationArrows";

export default function History() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const glowRef = useRef(null);
  const totalSlides = 8; // Total number of slides

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
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Update slides container transform
  useEffect(() => {
    const slidesContainer = document.querySelector(".slides-container");
    if (slidesContainer) {
      slidesContainer.style.transform = `translateY(calc(-${currentSlide} * (100vh - 126.11px)))`;
    }
  }, [currentSlide]);

  // Use custom hook for keyboard, wheel, and touch navigation
  useSlideNavigation(currentSlide, totalSlides, isAnimating, goToSlide);

  return (
    <div className="history-page">
      {/* Mouse Glow Effect */}
      <div ref={glowRef} className="mouse-glow"></div>

      <div className="slides-container">
        {/* Slide 1 - Introduction */}
        <div className={`slide slide-1 ${currentSlide === 0 ? "active" : ""}`}>
          <div className="slide-content">
            <h1 className="slide-title">Floods Definition and Causes</h1>
            {/* <p className="slide-subtitle" >
              Understanding and Predicting Natural Disasters
            </p> */}
            <div className="slide-description">
              <p className="intro-text-large">
                Floods happen when water overflows onto normally dry land due to natural or human-made factors such as heavy rain, melting snow, storm surges, or dam failures. They may develop quickly or over several days and can damage homes, infrastructure, farms, and endanger lives.
              </p>
              <p>
                Flooding occurs when rivers, lakes, or seas exceed their limits or when the ground cannot absorb water fast enough. Major causes include intense or long-lasting rain, rapid snowmelt, tsunamis, dam breaks, or poor drainage systems.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 2 - Types of Floods */}
        <div className={`slide slide-2 ${currentSlide === 1 ? "active" : ""}`}>
          <div className="slide-content">
            <h1 className="slide-title">Types of Floods</h1>
            <p className="slide-subtitle">
              Understanding Different Flood Categories
            </p>
            <div className="slide-description">
              <ul className="slide-list">
                <li>
                  <strong>Flash Floods:</strong> Happen rapidly, often within minutes to hours of heavy rain, leading to dangerous and sudden water rises.
                </li>
                <li>
                  <strong>River Floods:</strong> When rivers or streams exceed capacity due to sustained rain or snowmelt.

                </li>
                <li>
                  <strong>Coastal Floods:</strong> Caused by oceanic surges from tropical cyclones, tsunamis, or high tides.
                </li>
                <li>
                  <strong>Urban Floods:</strong> Result from heavy rain overwhelming city drainage, regardless of proximity to rivers or seas.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Slide 3 - Climate Change */}
        <div className={`slide slide-3 ${currentSlide === 2 ? "active" : ""}`}>
          <div className="slide-content">
            <h1 className="slide-title">Climate Change Impact</h1>
            <p className="slide-subtitle">Rising Risks and Challenges</p>
            <div className="slide-description">
              <p className="slide-intro-text">
                Climate change strongly affects how often and how severely floods
                occur. Warmer global temperatures allow the atmosphere to hold
                more moisture, resulting in heavier and more intense rainfall that
                can overwhelm rivers, drainage systems, and flood defenses,
                increasing both river and flash floods.
              </p>
              <p>
                Rising sea levels—caused by melting glaciers and the expansion of
                warmer seawater—also worsen coastal flooding by enabling storm
                surges and high tides to reach farther inland. In addition, climate
                change makes precipitation patterns more unpredictable and
                variable.
              </p>
            </div>
          </div>
        </div>

        {/* Slide 4 - Historical Impact */}
        <div className={`slide slide-4 ${currentSlide === 3 ? "active" : ""}`}>
          <div className="slide-content slide-2-layout">
            {/* Left Side - Image */}
            <div className="slide-2-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=80"
                alt="Devastating flood disaster"
                className="slide-2-image"
              />
            </div>

            {/* Right Side - Text Content */}
            <div className="slide-2-text">
              <h1 className="slide-title">Historical Impact</h1>
              <p className="slide-subtitle">
                Devastating Flood Events Through Time
              </p>
              <div className="slide-description">
                <ul className="slide-list">
                  <li>
                    1931 China Floods - Over 1 million casualties, worst natural
                    disaster
                  </li>
                  <li>
                    1953 North Sea Flood - 2,551 deaths across Netherlands and
                    UK
                  </li>
                  <li>
                    2010 Pakistan Floods - 20 million people affected, $10B
                    damage
                  </li>
                  <li>
                    2011 Thailand Floods - 815 deaths, economic impact of $45
                    billion
                  </li>
                  <li>
                    2013 European Floods - €12 billion in damages across Central
                    Europe
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 5 - Modern Solutions */}
        <div className={`slide slide-5 ${currentSlide === 4 ? "active" : ""}`}>
          <div className="slide-content">
            <h1 className="slide-title">Modern Solutions</h1>
            <p className="slide-subtitle">
              Technology and Prevention Strategies
            </p>
            <div className="slide-description">
              <ul className="slide-list">
                <li>
                  <strong>Real-time Monitoring:</strong> Satellite imagery and
                  IoT sensors provide continuous data on water levels and
                  weather patterns
                </li>
                <li>
                  <strong>AI Prediction Models:</strong> Machine learning
                  algorithms analyze historical data to forecast flood events
                  with high accuracy
                </li>
                <li>
                  <strong>Early Warning Systems:</strong> Automated alerts
                  notify communities hours or days before flooding occurs
                </li>
                <li>
                  <strong>Smart Infrastructure:</strong> Adaptive drainage
                  systems and flood barriers that respond to real-time
                  conditions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Slide 6 - Early Warning Systems */}
        <div className={`slide slide-6 ${currentSlide === 5 ? "active" : ""}`}>
          <div className="slide-content">
            <h1 className="slide-title">Early Warning Systems</h1>
            <p className="slide-subtitle">Saving Lives Through Technology</p>
            <div className="slide-description">
              <p className="slide-intro-text">
                Effective early warning systems combine multiple data sources to
                provide timely and accurate flood predictions.
              </p>
              <ul className="slide-list">
                <li>
                  Weather radar and satellite monitoring for precipitation
                  tracking
                </li>
                <li>
                  River gauges and water level sensors for real-time
                  measurements
                </li>
                <li>
                  Hydrological models predicting water flow and accumulation
                </li>
                <li>Mobile alerts and emergency broadcasting systems</li>
                <li>Community-based monitoring and rapid response protocols</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Slide 7 - Infrastructure & Prevention */}
        <div className={`slide slide-7 ${currentSlide === 6 ? "active" : ""}`}>
          <div className="slide-content">
            <h1 className="slide-title">Infrastructure & Prevention</h1>
            <p className="slide-subtitle">Building Resilient Communities</p>
            <div className="slide-description">
              <ul className="slide-list">
                <li>
                  <strong>Levees and Floodwalls:</strong> Physical barriers
                  protecting populated areas from overflow
                </li>
                <li>
                  <strong>Retention Basins:</strong> Temporary storage areas
                  that control water flow during heavy rainfall
                </li>
                <li>
                  <strong>Green Infrastructure:</strong> Wetlands, parks, and
                  permeable surfaces that naturally absorb water
                </li>
                <li>
                  <strong>Improved Drainage:</strong> Modern systems designed
                  for extreme weather events
                </li>
                <li>
                  <strong>Zoning Regulations:</strong> Restricting development
                  in high-risk flood zones
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Slide 8 - Our Mission */}
        <div className={`slide slide-8 ${currentSlide === 7 ? "active" : ""}`}>
          <div className="slide-content">
            <h1 className="slide-title">Our Mission</h1>
            <p className="slide-subtitle">Making a Difference Together</p>
            <div className="slide-description">
              <p className="mission-text-large">
                Floods Insights is committed to reducing the impact of floods
                through innovation, education, and community engagement.
              </p>
              <ul className="slide-list">
                <li>
                  Providing accessible flood risk information to communities
                  worldwide
                </li>
                <li>
                  Developing advanced prediction models using AI and machine
                  learning
                </li>
                <li>
                  Collaborating with governments and organizations for better
                  preparedness
                </li>
                <li>
                  Educating the public about flood risks and prevention
                  strategies
                </li>
                <li>
                  Contributing to global climate adaptation and resilience
                  efforts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="history-graph-section">
        <div className="graph-card">
          <h2 className="graph-title">Flood Risk Trends</h2>
          <p className="graph-subtitle">
            Add a graph illustrating climate-driven flood changes.
          </p>
          <div className="graph-placeholder">
            <img
              src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80"
              alt="Graph placeholder showing flood risk trends"
            />
          </div>
        </div>
      </div>

      {/* Compact control stack on the right: Up button, dots, Down button */}
      <div className="indicator-stack">
        {currentSlide > 0 && (
          <button
            className="nav-arrow nav-arrow-up nav-arrow--compact"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        )}

        <SlideIndicator
          totalSlides={totalSlides}
          currentSlide={currentSlide}
          onSlideChange={goToSlide}
        />

        {currentSlide < totalSlides - 1 && (
          <button
            className="nav-arrow nav-arrow-down nav-arrow--compact"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
