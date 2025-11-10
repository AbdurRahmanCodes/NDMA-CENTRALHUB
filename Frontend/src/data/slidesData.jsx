import Slide from "../components/history/Slide";

export const slidesData = [
  {
    id: 1,
    title: "Floods Insights",
    subtitle: "Understanding and Predicting Natural Disasters",
    content: (
      <>
        <p style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
          Floods are among the most devastating natural disasters, affecting
          millions of people worldwide each year.
        </p>
        <p>
          Our mission is to leverage cutting-edge technology and data analysis
          to predict, monitor, and mitigate the impact of floods on communities
          around the globe.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "Historical Impact",
    subtitle: "Devastating Flood Events Through Time",
    content: (
      <ul className="slide-list">
        <li>
          1931 China Floods - Over 1 million casualties, worst natural disaster
        </li>
        <li>1953 North Sea Flood - 2,551 deaths across Netherlands and UK</li>
        <li>2010 Pakistan Floods - 20 million people affected, $10B damage</li>
        <li>
          2011 Thailand Floods - 815 deaths, economic impact of $45 billion
        </li>
        <li>
          2013 European Floods - €12 billion in damages across Central Europe
        </li>
      </ul>
    ),
  },
  {
    id: 3,
    title: "Modern Solutions",
    subtitle: "Technology Meets Disaster Prevention",
    content: (
      <>
        <p style={{ fontSize: "1.3rem", marginBottom: "2rem" }}>
          Advanced technology is revolutionizing how we predict and respond to
          floods
        </p>
        <ul className="slide-list">
          <li>AI-powered prediction systems analyzing weather patterns</li>
          <li>Real-time satellite monitoring and data collection</li>
          <li>IoT sensor networks for river and water level tracking</li>
          <li>Mobile apps for instant alerts and evacuation guidance</li>
        </ul>
      </>
    ),
  },
  {
    id: 4,
    title: "Climate Change Impact",
    subtitle: "The Growing Flood Crisis",
    content: (
      <>
        <p style={{ fontSize: "1.3rem", marginBottom: "2rem" }}>
          Climate change is intensifying flood risks globally
        </p>
        <ul className="slide-list">
          <li>Sea levels rising by 3.3mm per year since 1993</li>
          <li>Extreme rainfall events increased by 30% since 1960</li>
          <li>Arctic ice melting at unprecedented rates</li>
          <li>100-year floods now occurring every 20-30 years</li>
        </ul>
      </>
    ),
  },
  {
    id: 5,
    title: "Types of Floods",
    subtitle: "Understanding Different Flood Categories",
    content: (
      <ul className="slide-list">
        <li>
          <strong>Flash Floods</strong> - Rapid onset within 6 hours, extremely
          dangerous
        </li>
        <li>
          <strong>River Floods</strong> - Overflow from sustained rainfall or
          snowmelt
        </li>
        <li>
          <strong>Coastal Floods</strong> - Storm surge, tsunamis, and high
          tides
        </li>
        <li>
          <strong>Urban Floods</strong> - Overwhelmed drainage in developed
          areas
        </li>
        <li>
          <strong>Pluvial Floods</strong> - Surface water flooding from heavy
          rain
        </li>
      </ul>
    ),
  },
  {
    id: 6,
    title: "Early Warning Systems",
    subtitle: "Saving Lives Through Timely Alerts",
    content: (
      <>
        <p style={{ fontSize: "1.3rem", marginBottom: "2rem" }}>
          Advanced warning systems can reduce casualties by up to 80%
        </p>
        <ul className="slide-list">
          <li>Doppler weather radar for precipitation tracking</li>
          <li>Automated river gauge networks with real-time data</li>
          <li>Multi-channel alert systems (SMS, radio, sirens)</li>
          <li>Community-based early warning teams</li>
        </ul>
      </>
    ),
  },
  {
    id: 7,
    title: "Infrastructure Solutions",
    subtitle: "Engineering Against Nature's Force",
    content: (
      <>
        <p style={{ fontSize: "1.3rem", marginBottom: "2rem" }}>
          Strategic infrastructure reduces flood damage by billions annually
        </p>
        <ul className="slide-list">
          <li>Dams and reservoirs for controlled water release</li>
          <li>Levees and floodwalls protecting vulnerable areas</li>
          <li>Permeable pavements and improved drainage systems</li>
          <li>
            Green infrastructure: wetlands, retention basins, urban forests
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 8,
    title: "Our Mission",
    subtitle: "Floods Insights - Protecting Tomorrow",
    content: (
      <>
        <p
          style={{
            fontSize: "1.5rem",
            marginBottom: "2rem",
            fontWeight: "600",
          }}
        >
          Empowering communities with AI-driven flood prediction and
          comprehensive disaster management
        </p>
        <ul className="slide-list">
          <li>Real-time flood risk assessment and mapping</li>
          <li>Predictive analytics for early intervention</li>
          <li>Detailed PDF reports for emergency agencies</li>
          <li>24/7 monitoring and instant alert systems</li>
          <li>Collaborative platform for disaster response coordination</li>
        </ul>
      </>
    ),
  },
];

export function renderSlides() {
  return slidesData.map((slide) => (
    <Slide
      key={slide.id}
      slideNumber={slide.id}
      title={slide.title}
      subtitle={slide.subtitle}
    >
      {slide.content}
    </Slide>
  ));
}
