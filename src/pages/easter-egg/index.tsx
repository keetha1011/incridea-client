import { useMutation, useQuery } from "@apollo/client";
import { NextPage } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import ImageUpload from "~/components/easter-egg/imageUpload";
import Spinner from "~/components/spinner";
import {
  CreateSubmissionDocument,
  DayType,
  GetCardsDocument,
  MySubmissionsDocument,
} from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

type Props = {};

const EasterEgg: NextPage = (props: Props) => {
  const [imageFiles, setImageFiles] = useState<(File | null)[] | []>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const { status, loading: authLoading } = useAuth();

  const getDay = () => {
    const date = new Date();
    const day = date.getDate();
    if (day === 26) return "Day1";
    if (day === 27) return "Day2";
    if (day === 28) return "Day3";
    if (day === 29) return "Day4";
  };

  const {
    data: cards,
    loading: cardsLoading,
    error: cardsError,
  } = useQuery(GetCardsDocument, {
    variables: {
      day: getDay() as DayType,
    },
  });

  const {
    data: submissions,
    loading: submissionsLoading,
    error: submissionsError,
  } = useQuery(MySubmissionsDocument, {
    variables: {
      day: getDay() as DayType,
    },
  });
  console.log(submissions);

  const [submissionMutation, { data, loading, error }] = useMutation(
    CreateSubmissionDocument,
  );

  useEffect(() => {
    if (cards?.getCards.__typename === "QueryGetCardsSuccess") {
      setImageFiles(new Array(cards.getCards.data.length).fill(null));
    }
  }, [cards]);

  if (authLoading)
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#41acc9] via-[#075985] to-[#2d6aa6] pt-28">
        <div className="mt-10 text-center text-xl text-white/90">
          <Spinner intent={"white"} size={"large"} />
        </div>
      </div>
    );
  if (status !== "authenticated")
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#41acc9] via-[#075985] to-[#2d6aa6] pt-28">
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
    <div className="relative min-h-screen bg-gradient-to-b from-[#41acc9] via-[#075985] to-[#2d6aa6]">
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
                  <div className="flex grow flex-col md:px-6 md:pb-4">
                    <ImageUpload
                      cardId={card.id}
                      loading={submissionsLoading}
                      existingImage={
                        submissions?.submissionsByUser.__typename ===
                        "QuerySubmissionsByUserSuccess"
                          ? submissions?.submissionsByUser.data.filter(
                              (submission) => submission.cardId === card.id,
                            )[0]?.image
                          : null
                      }
                      setImage={(file) => {
                        setSaved(false);
                        setImageFiles((prev) => {
                          const newFiles = [...prev];
                          newFiles[index] = file;
                          return newFiles;
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* <Button disabled={saving} className="mt-10" onClick={onSave}>
              {saving ? (
                <>
                  Saving <Spinner intent={"white"} size={"small"} />
                </>
              ) : saved ? (
                <>
                  Saved <FaCheck color="white" />
                </>
              ) : (
                "Save"
              )}
            </Button> */}
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
