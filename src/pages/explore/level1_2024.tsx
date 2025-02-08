import dynamic from "next/dynamic";

const ExploreGame = dynamic(() => import("~/components/exploreGame/"), {
  ssr: false,
});

export default function Level1_2024() {
  return <ExploreGame />;
}
