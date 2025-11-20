import "./TeamSection.css";
import fawzyPhoto from "../../assets/team/Fawzy.jpg";
import marwanPhoto from "../../assets/team/Marwan.jpg";
import nourPhoto from "../../assets/team/Nour.jpg";
import sultanPhoto from "../../assets/team/Sultan.png";

const teamMembers = [
  // {
  //   name: "Nour Eldeen Okbi",
  //   role: "Front-End Developer",
  //   bio: "Frontend developer specializing in building responsive, data-driven web applications using React, TypeScript, and modern UI frameworks.",
  //   imagePath: nourPhoto,
  //   details:
  //     "Experienced in React, Next.js, Tailwind, and state management. Worked with geospatial tools like ArcGIS JS SDK and Leaflet to build interactive GIS dashboards.",
  // },
  // {
  //   name: "Nour Eldeen Okbi",
  //   role: "Front-End Developer",
  //   bio: "Specialized in building responsive, data-driven applications using React, TypeScript, and modern UI frameworks.",
  //   imagePath: nourPhoto,
  //   details:
  //     "Skilled in React, Next.js, Tailwind, and state management, with hands-on GIS experience using ArcGIS JS SDK and Leaflet.",
  // },
  {
    name: "Nour Eldeen Okbi",
    role: "Front-End / React Developer",
    bio: "Specialized in building responsive, data-driven applications using React, TypeScript, and modern UI frameworks.",
    imagePath: nourPhoto,
    details:
      "Skilled in React, Next.js, Tailwind, and state management, with hands-on GIS experience using ArcGIS JS SDK, Leaflet, ArcGIS Online, ArcGIS Pro, and building interactive geospatial dashboards.",
  },
  {
    name: "Marwan El-mehy",
    role: "Backend Engineer",
    bio: "Designing and building scalable backend services and APIs to support real-time risk assessment and automated recognition systems.",
    imagePath: marwanPhoto,
    details:
      "Specializes in integrating data pipelines and service-level outputs with emergency response and decision-making platforms.",
  },
  {
    name: "Mohamed Sultan",
    role: "Data Scientist",
    bio: "Manages data lifecycle, including acquisition, cleaning, validation, and integration of satellite and sensor feeds.",
    imagePath: sultanPhoto,
    details:
      "Ensures the integrity و reliability of all geospatial data sources.",
  },
  {
    name: "Magdy Adel",
    role: "Project & Operations Lead",
    bio: "Overseeing the strategic roadmap, team coordination, and system deployment.",
    // imagePath: magdyPhoto,
    details:
      "A dedicated leader focused on turning technology into real-world impact.",
  },
  {
    name: "Ahmed Fawzy Fawzy",
    role: "GIS Specialist",
    bio: "",
    imagePath: fawzyPhoto,
    details: "",
  },
];
export default function TeamSection() {
  return (
    <section className="team-section">
      <div className="team-container">
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member-card">
              <div className="member-media">
                <div className="member-image-wrapper">
                  <img
                    src={member.imagePath}
                    alt={member.name}
                    className="member-photo"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const fallback = e.target
                        .closest(".team-member-card")
                        .querySelector(".member-avatar-fallback");
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div className="member-avatar-fallback">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="member-image-overlay" />
                </div>

                <div className="member-info-default">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </div>

                <div className="member-more">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                  <p className="member-details">{member.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
