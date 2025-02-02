import { useQuery } from "@apollo/client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC, useEffect, useState } from "react";
import { FaAward } from "react-icons/fa";
import Button from "~/components/button";
import { env } from "~/env";
import {
  GetUserXpDocument,
  GetXpLeaderboardDocument,
} from "~/generated/generated";

const techTeamPid = [11, 15, 2, 1, 10, 9, 509, 59, 4, 8, 13, 16, 291, 74];

const ProfileInfo: FC = () => {
  const router = useRouter();

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
    <div className="w-full flex flex-wrap gap-4 justify-evenly lg:justify-between items-center  rounded-md lg:rounded-full border border-white px-4 md:px-6 lg:px-8 py-3">
      <div className="flex gap-2 items-center justify-center">
        <Image
          src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/trophy.png`}
          width={100}
          height={100}
          alt="map"
          className="h-12 w-12 sm:h-16 sm:w-16"
        />

        <Link href="/leaderboard">
          <div>
            <p className="">Leaderboard</p>
            <p className="font-bold text-secondary-600">Rank {rank}</p>
          </div>
        </Link>
      </div>

      <p className="text-center">
        You need{" "}
        <span className="font-bold text-secondary-600">{needMore} XP</span> to
        level up!
      </p>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-2 justify-center">
        <Button onClick={() => router.push("/leaderboard")} className="text-sm">
          <FaAward className="mr-1 inline-block" />
          Leaderboard
        </Button>

        <Button className="text-sm text-center" onClick={() => signOut()}>
          <div className="w-full h-full">SignOut</div>
        </Button>
      </div>
    </div>
  );
};

export default ProfileInfo;
