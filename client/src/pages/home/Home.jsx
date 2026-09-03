import React from "react";
import HeroSection from "./HeroSection";
import HomeFeatureCards from "./HomeFeatureCards";
import JobSourceTabs from "./JobSourceTabs";
import PopularSearches from "../../components/home/PopularSearches";
import SourceCards from "../../components/home/SourceCards";

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />

      <HomeFeatureCards />

      <section className="home-section">
        <div className="container">
          <PopularSearches />
        </div>
      </section>

      <JobSourceTabs />

      <section className="home-section">
        <div className="container">
          <SourceCards />
        </div>
      </section>
    </div>
  );
};

export default Home;
