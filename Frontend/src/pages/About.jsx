import "./About.css";
import TeamSection from "../components/about/TeamSection";

export default function About() {
  return (
    <div className="about-page">
      <header className="about-header">
        <div className="page-container header-content">
          <h1 className="page-title">Meet Our Team</h1>
          <p className="page-description">
            Flodix is created by a small team of developers focused on
            delivering simple, data-driven tools for understanding flood risk.
            Our goal is to make environmental insights accessible through a
            clean and interactive experience.
          </p>
        </div>
      </header>

      <TeamSection />
    </div>
  );
}
