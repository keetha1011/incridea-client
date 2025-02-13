import { useQuery } from "@apollo/client";
import { Bed, LogOut, QrCode, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaAward } from "react-icons/fa";
import { Button } from "~/components/button/button";
import { CONSTANT } from "~/constants";
import Image from "next/image";
import {
  GetUserXpDocument,
  GetXpLeaderboardDocument,
} from "~/generated/generated";
import { AuthStatus, useAuth } from "~/hooks/useAuth";

const techTeamPid = CONSTANT.PID.TECH_TEAM;

function LeaderBoard({
  setQr,
  isShowQr,
}: {
  setQr: () => void;
  isShowQr: boolean;
}) {
  const router = useRouter();
  const session = useAuth();

  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [userId, setUser] = useState("");
  const [rank, setRank] = useState(0);
  const [progress, setProgress] = useState(0);
  const [needMneedMoreore, setNeedMore] = useState(0);

  const userXp = useQuery(GetUserXpDocument, {});

  useEffect(() => {
    if (
      userXp?.data &&
      userXp.data.getUserXp.__typename === "QueryGetUserXpSuccess"
    ) {
      const totalXp = userXp.data.getUserXp?.data?.reduce((acc, curr) => {
        if (
          techTeamPid.includes(parseInt(curr.user.id)) &&
          parseInt(curr.level.id) <= 6
        )
          return acc;
        return acc + curr.level.point;
      }, 0);

      // Calculate the level thresholds dynamically
      const levels = userXp.data.getUserXp?.data?.length || 0;
      const newLevelThresholds = Array.from(
        { length: levels + 1 },
        (_, i) => (i + 1) * 10,
      );
      // Calculate the user's current level based on the thresholds
      let level = 1;
      let totalPoints = 0;
      let levelPoints = 0;

      for (const threshold of newLevelThresholds) {
        totalPoints += threshold;
        levelPoints = threshold;
        if (totalXp >= threshold) {
          level++;
        } else {
          break;
        }
      }
      setLevel(level);
      setXp(totalXp);
      if (userXp.data.getUserXp.data[0])
        setUser(userXp.data.getUserXp.data[0].user.id);
      console.log(totalPoints, totalXp, newLevelThresholds);

      setNeedMore(totalPoints - totalXp);
      setProgress(((levelPoints - totalPoints + totalXp) / levelPoints) * 100);
    }
    console.log("Progress : ", progress);
  }, [userXp.data]);

  type UserTotalPoints = {
    [userId: string]: {
      levelPoints: number;
      name: string;
      count: number;
      createdAt: Date;
    };
  };
  const { data: Leaderboard } = useQuery(GetXpLeaderboardDocument, {});

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
      const currentUserRank = userTotalPointsArray.findIndex(
        (item) => item.userId === userId,
      );
      setRank(currentUserRank + 1);
    }
  }, [Leaderboard, userId]);

  return (
    <div className="w-full flex flex-col gap-2  items-center justify-evenly row-span-1 border-secondary-500/50 border-t-2 p-2">
      <div className="w-full flex xl:flex-row md:flex-col sm:flex-row flex-col justify-between items-center flex-nowrap gap-2 sm:max-w-full max-w-sm">
        <Button
          className="w-full hover:scale-[105%] hover:bg-primary-800/60 text-white hover:text-white sm:max-w-full max-w-sm"
          variant={"outline"}
          onClick={() => setQr()}
        >
          {!isShowQr ? (
            <>
              <QrCode className="stroke-secondary-200" />
              Show QR
            </>
          ) : (
            <>
              <User className="stroke-secondary-200" />
              Show Name
            </>
          )}
        </Button>
        <Button
          variant={"destructive"}
          className="w-full hover:scale-[105%]"
          onClick={async () => {
            await signOut();
          }}
        >
          Log out <LogOut />
        </Button>
      </div>
      <div className="w-full h-fit relative overflow-hidden rounded-xl border-secondary-500/50 border-2 mt-2">
        <div
          className={`h-2 bg-amber-600`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="text-white w-full px-2 mb-2">
        <div className="flex justify-between w-full mb-4 flex-row px-4 max-w-md mx-auto">
          <div className="font-semibold text-sm">
            Domain{" "}
            <span className="text-secondary-500 font-bold text-base">
              {level} 🗺
            </span>
          </div>
          <div className="font-semibold text-sm">
            Timestones{" "}
            <span className="text-secondary-500 font-bold text-base">
              {xp} 💎
            </span>
          </div>
        </div>

        {rank === 0 ? (
          <>
            <div className="text-sm opacity-90 text-center my-2">
              You need to collect {needMneedMoreore} 💎 TimeStones to join the
              leaderboard
            </div>
          </>
        ) : (
          <>
            <div className="border bg-primary-500/20 border-secondary-500 max-w-md mx-auto rounded-full px-4 py-2 flex flex-row justify-between items-center">
              <div className="text-sm flex flex-row flex-nowrap gap-1 font-semibold">
                <Image
                  className="size-10"
                  src={`/${CONSTANT.YEAR}/profile/trophy.webp`}
                  alt="trophy"
                  width={100}
                  height={100}
                />
                <div>
                  <p>Leaderboard</p>
                  <p className="text-accent-400">Rank {rank}</p>
                </div>
              </div>
              <div className="text-sm flex flex-col gap-1 font-semibold">
                <p>You need</p>
                <p>
                  <span className="text-accent-400">{needMneedMoreore}</span> 💎
                  more
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="w-full flex flex-col gap-2 items-center">
        {/* TODO: Move component to the top */}
        {/* <div className="w-full flex xl:flex-row md:flex-col sm:flex-row flex-col justify-between items-center flex-nowrap gap-2 sm:max-w-full max-w-sm">
          <Button
            className="w-full hover:scale-[105%] hover:bg-primary-800/60 text-white hover:text-white sm:max-w-full max-w-sm"
            variant={"outline"}
            onClick={() => setQr()}
          >
            {!isShowQr ?(
              <>
                <QrCode className="stroke-secondary-200" />
                Show QR
              </>
            )
            :(<>
            <User className="stroke-secondary-200" />
            Show Name
            </>)
          }
          </Button>
          <Button
            variant={"destructive"}
            className="w-full hover:scale-[105%]"
            onClick={async () => {
              await signOut();
            }}
          >
            Log out <LogOut />
          </Button>
        </div> */}

        <div className="w-full flex xl:flex-row md:flex-col sm:flex-row flex-col justify-between items-center flex-nowrap gap-2 sm:max-w-full max-w-sm">
          <Button
            onClick={() => router.push("/leaderboard")}
            className="w-full px-1"
          >
            <FaAward className="mr-1 inline-block" />
            Leaderboard
          </Button>

          {session.status === AuthStatus.AUTHENTICATED &&
            session.user.college &&
            session.user.college.id !== "1" && (
              <Button className="py-2 w-full px-1 hover:scale-[105%]" asChild>
                <Link href="/accommodation">
                  <Bed />
                  Accomodation
                </Link>
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
