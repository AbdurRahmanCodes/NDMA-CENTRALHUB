import "./About.css";
import TeamSection from "../components/about/TeamSection";

export default function About() {
  return (
    <div className="about-page">
      <header className="about-header">
        <div className="page-container header-content">
          <h1 className="page-title">Meet Our Team</h1>
          <p className="page-description">
            The five developers behind Floods Insights.
          </p>
        </div>
      </header>

      <TeamSection />
    </div>
  );
}
