"use client";

import { useQuery } from "@apollo/client";
import { type NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "~/components/event/styles.module.css";
import Spinner from "~/components/spinner";
import { env } from "~/env";
import { GetXpLeaderboardDocument } from "~/generated/generated";
import { idToPid } from "~/utils/id";

const techTeamPid = [11, 15, 2, 1, 10, 9, 509, 59, 4, 8, 13, 16, 291, 74];

const LeaderBoard: NextPage = () => {
  interface UserTotalPoints {
    [userId: string]: {
      levelPoints: number;
      name: string;
      count: number;
      createdAt: string;
    };
  }
  const { data: Leaderboard, loading: leaderboardLoading } = useQuery(
    GetXpLeaderboardDocument,
    {},
  );

  const [sortedLeaderboard, setSortedLeaderboard] = useState<
    {
      levelPoints: number;
      name: string;
      userId: string;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    if (
      Leaderboard?.getXpLeaderboard.__typename ===
      "QueryGetXpLeaderboardSuccess"
    ) {
      const userTotalPoints: UserTotalPoints = {};

      Leaderboard?.getXpLeaderboard.data.forEach((item) => {
        const userId = item.user.id;
        const levelPoints = item.level.point;
        const userName = item.user.name;
        const levelCount = 1;
        const createdAt = item.createdAt;

        // Check if the user ID is already in the userTotalPoints object
        if (userTotalPoints[userId]) {
          // If yes, add the level points to the existing total
          userTotalPoints[userId].levelPoints += levelPoints;
          userTotalPoints[userId].count += levelCount;
          //store only the latest date
          if (createdAt > userTotalPoints[userId].createdAt) {
            userTotalPoints[userId].createdAt = createdAt;
          }
        } else {
          if (
            techTeamPid.includes(parseInt(userId)) &&
            parseInt(item.level.id) <= 6
          )
            return;
          // If no, create a new entry for the user ID
          userTotalPoints[userId] = {
            levelPoints,
            name: userName,
            count: 1,
            createdAt: createdAt,
          };
        }
      });
      // Convert userTotalPoints to an array of objects
      const userTotalPointsArray = Object.entries(userTotalPoints).map(
        ([userId, data]) => ({
          userId,
          ...data,
        }),
      );

      // Sort the array in descending order based on total points
      userTotalPointsArray.sort((a, b) => b.levelPoints - a.levelPoints);

      //also sort based on the latest date but points should be primary
      userTotalPointsArray.sort((a, b) => {
        if (a.levelPoints === b.levelPoints) {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return b.levelPoints - a.levelPoints;
      });
      // Limit to the top 15 entries
      const top15Users = userTotalPointsArray.slice(0, 15);
      setSortedLeaderboard(top15Users);
    }
  }, [Leaderboard]);

  const getColor = (i: number) => {
    if (i === 1) {
      return "bg-gradient-to-b from-amber-400 to-yellow-700";
    } else if (i === 2) {
      return "bg-gradient-to-b from-slate-500 to-slate-700";
    } else if (i === 3) {
      return "bg-gradient-to-b from-amber-700 to-amber-900";
    } else {
      return "bg-gradient-to-r from-slate-900 to-slate-700";
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      className={``}
      style={{ willChange: "transform", overflowX: "hidden" }}
    >
      {sortedLeaderboard.length > 0 && (
        <div className={`${styles.container} overflow-hidden`}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className={`${styles.confetti}`}></div>
          ))}
        </div>
      )}
      <div className="relative min-h-screen bg-gradient-to-b from-primary-300 to-primary-400">
        <div className="relative min-h-screen bg-white bg-gradient-to-bl py-32">
          <h1
            className={`text-center font-VikingHell text-5xl text-white md:text-5xl`}
          >
            XP Leaderboard
          </h1>
          <h3 className="mx-2 my-6 text-center text-xl text-white md:mx-0 md:text-3xl">
            Embark on an XP Quest: Uncover Hidden Easter Eggs and Level Up Your
            Experience!
          </h3>
          <div className="mx-5 mb-2 mt-10 flex h-16 items-center justify-evenly rounded-lg rounded-t-lg border border-primary-200/80 bg-primary-500 bg-opacity-20 bg-clip-padding p-1 text-sm font-bold text-white backdrop-blur-lg backdrop-filter md:mx-36 md:mt-7 md:text-2xl">
            <h1 className="basis-1/4 text-center">Position</h1>
            <h1 className="basis-1/4 text-center">Player Id</h1>
            <h1 className="basis-1/4 text-center">Player Name</h1>
            <h1 className="basis-1/4 text-center">Xp Gained</h1>
          </div>
          {leaderboardLoading && (
            <div className="mt-10 flex items-center justify-center">
              <Spinner className="text-gray-300" />
            </div>
          )}
          <div className="bodyFont mx-5 flex flex-col gap-2 text-center text-white md:mx-36">
            {sortedLeaderboard.map((user, i) => (
              <div
                key={user.userId}
                className={`${getColor(
                  i + 1,
                )} flex h-16 flex-row items-center justify-center rounded-lg shadow-2xl`}
              >
                <h1 className="flex basis-1/4 items-center justify-center text-center text-base md:gap-1 md:text-xl">
                  {i + 1}.
                  <Image
                    src={
                      i + 1 === 1
                        ? `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/level3.png`
                        : i + 1 === 2
                          ? `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/level2.png`
                          : i + 1 === 3
                            ? `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/level1.png`
                            : `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/level4.png`
                    }
                    width={isMobile ? 20 : 50}
                    height={isMobile ? 20 : 50}
                    alt="medal"
                    className="z-30 flex w-10 items-center justify-center bg-transparent text-5xl md:w-auto"
                  />
                </h1>
                <h1 className="mx-2 flex basis-1/4 items-center justify-center text-center text-sm font-semibold md:text-xl">
                  {idToPid(user.userId)}
                </h1>
                <h1 className="flex basis-1/4 items-center justify-center text-center text-sm font-semibold capitalize md:text-xl">
                  {user.name}
                </h1>
                <h1 className="flex basis-1/4 flex-row items-center justify-center text-center text-sm font-semibold md:text-xl">
                  {user.levelPoints}
                  <Image
                    src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/XP.png`}
                    width={isMobile ? 20 : 40}
                    height={isMobile ? 20 : 40}
                    alt="medal"
                    className="ml-1 w-10 bg-transparent text-5xl md:w-10"
                  />
                </h1>
              </div>
            ))}
            {sortedLeaderboard.length === 0 && !leaderboardLoading && (
              <div className="mx-3 mt-2 flex items-center justify-center">
                <span className="text-base text-gray-300 md:text-xl">
                  The XP leaderboard is currently as empty as a blank canvas,
                  waiting for the vibrant colors of your achievements to fill it
                  up!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
