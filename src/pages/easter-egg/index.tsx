import { useQuery } from "@apollo/client";
import { type NextPage } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

import Spinner from "~/components/spinner";
import {
  type DayType,
  GetCardsDocument,
  MySubmissionsDocument,
} from "~/generated/generated";
import { AuthStatus, useAuth } from "~/hooks/useAuth";

const EasterEgg: NextPage = () => {
  const { status, loading: authLoading } = useAuth();

  const getDay = () => {
    const date = new Date();
    const day = date.getDate();
    if (day === 26) return "Day1";
    if (day === 27) return "Day2";
    if (day === 28) return "Day3";
    if (day === 29) return "Day4";
  };

  const { data: cards, loading: cardsLoading } = useQuery(GetCardsDocument, {
    variables: {
      day: getDay() as DayType,
    },
  });

  const { data: submissions } = useQuery(MySubmissionsDocument, {
    variables: {
      day: getDay() as DayType,
    },
  });
  console.log(submissions);

  if (authLoading)
    return (
      <div className="relative min-h-screen pt-28">
        <div className="mt-10 text-center text-xl text-white/90">
          <Spinner intent={"white"} size={"large"} />
        </div>
      </div>
    );
  if (status !== AuthStatus.AUTHENTICATED)
    return (
      <div className="relative min-h-screen pt-28">
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center text-xl text-white/90">
          <span className="text-3xl font-semibold">Uh-oh! </span>
          <span>
            You need to{" "}
            <Link className="underline" href={"/login"}>
              login
            </Link>{" "}
            to view easter eggs
          </span>
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen">
      <Toaster />
      <div className="flex flex-col items-center justify-center px-6 pb-12 pt-28 md:px-12">
        <h2 className="titleFont mb-8 text-center text-4xl text-white">
          Upload your images!
        </h2>
        <h2 className="bodyFont mb-3 text-center text-xl text-white">
          Find clues across the campus and upload them here
        </h2>
        <h2 className="bodyFont mb-8 text-center text-xl font-semibold text-white">
          Note: Your submissions are autosaved after uploading
        </h2>
        {cardsLoading ? (
          <Spinner />
        ) : cards?.getCards.__typename === "QueryGetCardsSuccess" ? (
          <>
            <div className="flex max-w-6xl flex-wrap justify-center gap-8 text-white/90">
              {cards.getCards.data.map((card, index) => (
                <div
                  key={index}
                  className="flex min-w-[300px] basis-full flex-col rounded-md bg-black/20 shadow-sm md:basis-[45%]"
                >
                  <h2 className="titleFont mb-2 px-4 pt-4 text-xl md:px-6 md:pt-6">
                    Clue {index + 1}
                  </h2>
                  <h2 className="bodyFont mb-3 px-4 md:px-6">{card.clue}</h2>
                  <div className="flex grow flex-col md:px-6 md:pb-4"></div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <span className="text-white/60">
            Could not fetch clues, please try again later
          </span>
        )}
      </div>
    </div>
  );
};

export default EasterEgg;
