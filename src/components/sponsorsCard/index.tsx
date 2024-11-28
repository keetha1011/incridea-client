import Image from "next/image";
import React from "react";
import { FiExternalLink } from "react-icons/fi";

import Button from "~/components/button";
import { Sponsor } from "~/constants/sponsors";
import { env } from "~/env";

type SponsorCardProps = {
  sponsor: Sponsor;
  isEven: boolean;
};

const SponsorCard: React.FunctionComponent<SponsorCardProps> = ({
  sponsor,
  isEven,
}) => {
  return (
    <div
      className={`mt-3 flex min-h-[300px] w-full flex-col items-center justify-between gap-5 rounded-2xl border border-primary-200/70 bg-primary-500 px-10 py-8 text-white opacity-[0.98] md:max-w-full ${
        isEven ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <div className="relative flex aspect-square h-52 w-52 items-center justify-center">
        <Image
          src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/sponsors/${sponsor.logo}`}
          fill={true}
          alt={sponsor.name + " logo"}
          className="rounded-2xl object-contain"
        />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-between gap-7">
        <div className="flex flex-col items-center justify-between gap-2">
          <h2 className="text-center text-3xl">
            {sponsor.name.toLocaleUpperCase()}
          </h2>
          <h3 className="text-center text-xl text-white/70">{sponsor.title}</h3>
        </div>
        <p className="max-w-prose text-justify text-base leading-7 text-slate-300 md:text-lg md:leading-8">
          {sponsor?.desc}
        </p>
        {sponsor.websiteURL && (
          <a href={sponsor.websiteURL} target="_blank" rel="noreferrer">
            <Button className="w-max" size={"large"}>
              Visit Website <FiExternalLink />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default SponsorCard;
