import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import heroImage from "../assets/1.jpg";
import featuresImage from "../assets/2.jpg";
import logo from "../assets/logo.png";
import EarthquakeIcon from "../components/icons/EarthquakeIcon";
import FloodIcon from "../components/icons/FloodIcon";
import ReportIcon from "../components/icons/ReportIcon";
import AgencyIcon from "../components/icons/AgencyIcon";
import StatsIllustration from "../components/icons/StatsIllustration";
import BoxIcon from "../components/icons/BoxIcon";
import CheckCircleIcon from "../components/icons/CheckCircleIcon";
import ClockIcon from "../components/icons/ClockIcon";

export default function Homepage() {
  const observerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Create intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe all elements with animate-on-scroll class
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observerRef.current.observe(el));

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="homepage">
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Predicting Natural Disasters,
              <span className="gradient-text"> Protecting Lives</span>
            </h1>
            <p className="hero-description">
              Advanced AI-powered analysis of earthquakes and floods to provide
              actionable insights. Get comprehensive PDF reports with risk
              assessments and safety instructions tailored for emergency
              response agencies.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Start Analysis</button>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="features"
        style={{ backgroundImage: `url(${featuresImage})` }}
      >
        <div className="features-overlay"></div>
        <div className="features-container">
          <h2 className="section-title animate-on-scroll">How We Help</h2>
          <p className="section-description animate-on-scroll">
            Comprehensive disaster analysis and reporting for emergency agencies
          </p>

          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon earthquake">
                <EarthquakeIcon />
              </div>
              <h3 className="feature-title">Earthquake Analysis</h3>
              <p className="feature-description">
                Real-time seismic data analysis with historical pattern
                recognition to predict potential earthquake zones and their
                magnitude impacts.
              </p>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon flood">
                <FloodIcon />
              </div>
              <h3 className="feature-title">Flood Risk Mapping</h3>
              <p className="feature-description">
                Advanced geographic analysis identifying high-risk flood zones
                with weather pattern integration and terrain evaluation.
              </p>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon report">
                <ReportIcon />
              </div>
              <h3 className="feature-title">PDF Reports</h3>
              <p className="feature-description">
                Generate detailed PDF reports with risk assessments, evacuation
                routes, and actionable safety instructions for agencies.
              </p>
            </div>

            <div className="feature-card animate-on-scroll">
              <div className="feature-icon agencies">
                <AgencyIcon />
              </div>
              <h3 className="feature-title">Agency Coordination</h3>
              <p className="feature-description">
                Share insights directly with emergency response teams, enabling
                faster decision-making and coordinated disaster response
                efforts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="stats"
        style={{ backgroundImage: `url(${featuresImage})` }}
      >
        <div className="stats-content">
          <div className="stats-illustration animate-on-scroll">
            <StatsIllustration />
          </div>

          <div className="stats-grid animate-on-scroll">
            <div className="stat-item">
              <div className="stat-icon">
                <BoxIcon />
              </div>
              <h3 className="stat-number">10K+</h3>
              <p className="stat-label">Areas Analyzed</p>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <ReportIcon />
              </div>
              <h3 className="stat-number">500+</h3>
              <p className="stat-label">Reports Generated</p>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <CheckCircleIcon />
              </div>
              <h3 className="stat-number">98%</h3>
              <p className="stat-label">Accuracy Rate</p>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <ClockIcon />
              </div>
              <h3 className="stat-number">24/7</h3>
              <p className="stat-label">Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="cta"
        style={{ backgroundImage: `url(${featuresImage})` }}
      >
        <div className="cta-content animate-on-scroll">
          <div className="cta-logo-watermark">
            <img src={logo} alt="" className="cta-logo-image" />
          </div>
          <h2 className="cta-title">Ready to Analyze Your Region?</h2>
          <p className="cta-description">
            Start using our advanced tools to protect your community from
            natural disasters
          </p>
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate("/analyze")}
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
