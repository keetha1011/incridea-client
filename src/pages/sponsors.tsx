import { type NextPage } from "next";
import React from "react";
import SponsorGearCarousel from "~/components/sponsorsCard";

import sponsors from "~/constants/sponsors";

const Sponsors: NextPage = () => {
  return (
    <div className="relative w-full">
      <div style={{ height: `${sponsors.length * 100}vh` }} />
      <SponsorGearCarousel sponsors={sponsors} />
    </div>
  );
};

export default Sponsors;
