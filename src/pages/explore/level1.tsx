import dynamic from "next/dynamic";
const ExploreGame = dynamic(() => import("@/src/components/exploreGame/"), {
  ssr: false,
});

export default function Level1() {
  return <ExploreGame />;
}
