import { NextPage } from "next";
import { Tab } from "@headlessui/react";
import ChampionshipPointsPanel from "~/components/general/dashboard/analytics/championshipPointsPanel";

const Analytics: NextPage = () => {
  return (
    <div className="pt-20 px-5">
      <Tab.Group
        as={"div"}
        className="overflow-hidden border-0 border-gray-900/40 sm:rounded-xl flex flex-col"
      >
        <Tab.List className="flex w-full overflow-x-auto bg-gray-600/60 backdrop-blur-md justify-center">
          {[
            "Championship",
            "Fest Registration",
            "Event Registration",
            "Pronite Registrations",
          ].map((tab) => (
            <Tab key={tab} className="focus:outline-none">
              {({ selected }) => (
                <button
                  className={`whitespace-nowrap p-3 text-base font-semibold transition-colors sm:px-5 sm:py-4 sm:text-lg ${
                    selected
                      ? "bg-gray-900 text-white shadow-lg shadow-black"
                      : "bg-transparent text-white hover:bg-gray-800/60"
                  }`}
                >
                  {tab}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ChampionshipPointsPanel />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Analytics;
