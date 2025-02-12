import { useQuery } from "@apollo/client";
import { Bed, LogOut, QrCode, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaAward } from "react-icons/fa";
import { Button } from "~/components/button/button";
import {
  GetUserXpDocument,
  GetXpLeaderboardDocument,
} from "~/generated/generated";
import { AuthStatus, useAuth } from "~/hooks/useAuth";

const techTeamPid = [11, 15, 2, 1, 10, 9, 509, 59, 4, 8, 13, 16, 291, 74];
function LeaderBoard({ setQr, isShowQr }: { setQr: () => void; isShowQr: boolean }) {
  const router = useRouter();
  const session = useAuth();

  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [userId, setUser] = useState("");
  const [rank, setRank] = useState(0);
  const [progress, setProgress] = useState(0);
  const [needMore, setNeedMore] = useState(0);

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
      let level = 0;
      let totalPoints = 0;
      let levelPoints = 0;

      for (const threshold of newLevelThresholds) {
        if (totalXp >= threshold) {
          level++;
          totalPoints += threshold;
          levelPoints = threshold;
        } else {
          break;
        }
      }
      setLevel(level - 1);
      setXp(totalXp);
      if (userXp.data.getUserXp.data[0])
        setUser(userXp.data.getUserXp.data[0].user.id);
      setNeedMore(totalPoints - totalXp);
      setProgress(((levelPoints - totalPoints + totalXp) / levelPoints) * 100);
    }
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
        </div>
      <div className="w-full h-fit relative overflow-hidden rounded-xl border-secondary-500/50 border-2 mt-2">
        <div className={`h-2 bg-red-600 w-[${progress}%]`}></div>
      </div>

      <div className="text-white grid grid-cols-2 place-items-stretch px-2">
        <div>
          <h3 className="font-semibold">Leaderboard</h3>
          <strong>Rank {rank}</strong>
        </div>
        <div>
          <p>{xp}xp</p>
          {/* <p>you need {needMore} more xp</p> */}
          {needMore > 0 ? (
            <p>you need {needMore} more Timestones</p>
          ) : (
            <p>You have max Timestones</p>
          )}
        </div>
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

          {session.status === AuthStatus.AUTHENTICATED && session.user.college && session.user.college?.id !== "1" && 
            <Button className="py-2 w-full px-1 hover:scale-[105%]">
              <Bed />
              Accomodation
            </Button>
          }
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
