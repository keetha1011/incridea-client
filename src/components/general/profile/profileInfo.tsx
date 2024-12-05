import { useQuery } from "@apollo/client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import { type FC, useEffect, useState } from "react";
import { FaSignOutAlt, FaAward } from "react-icons/fa";
import { MdAddAPhoto, MdOutlineEmail, MdPhone } from "react-icons/md";
import { RiHotelBedLine } from "react-icons/ri";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
import { env } from "~/env";
import {
  AccommodationRequestsByUserDocument,
  GetUserXpDocument,
  GetXpLeaderboardDocument,
  Role,
  type User,
} from "~/generated/generated";
import { idToPid } from "~/utils/id";

import AvatarModal from "./avatarModal";
import ViewUserAccommodation from "./viewUserAccommodation";

const techTeamPid = [11, 15, 2, 1, 10, 9, 509, 59, 4, 8, 13, 16, 291, 74];

const ProfileInfo: FC<{
  user: User | null | undefined;
}> = ({ user }) => {
  const router = useRouter();
  const { data: dataAccommodation, loading: loadingAccommodation } = useQuery(
    AccommodationRequestsByUserDocument,
  );

  const [showModal, setShowModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);

  if (user && user.role === Role.User) void router.push("/register");

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
    <div className="flex flex-col items-center gap-5 rounded-xl border border-primary-200/80 bg-primary-500 px-4 py-4 text-white md:px-8 md:py-8">
      <div className="flex flex-col gap-5">
        <div
          className="flex items-start justify-center"
          onClick={() => setAvatarModal(true)}
        >
          <div className="overflow-hidden">
            <AvatarModal
              showModal={avatarModal}
              setShowModal={setAvatarModal}
            />
          </div>
          <div className="group relative">
            <Image
              src={user?.profileImage ?? ""}
              width={180}
              height={180}
              alt="avatar"
              className="cursor-pointer rounded-xl border border-primary-100/30 p-3 transition-all duration-300 hover:border-4 hover:border-primary-100/50"
            />
            <div className="absolute bottom-3 right-3 rounded-full bg-secondary-700 p-2 transition-all duration-300">
              <MdAddAPhoto />
            </div>
          </div>
        </div>
        <div className="flex h-full flex-col items-center justify-center space-y-1 text-center">
          <span className="text-2xl font-bold lg:text-3xl">{user?.name}</span>
          <span className="bodyFont">{user?.college?.name ?? "-"}</span>
        </div>
        <div className="relative mb-5 pt-1">
          <div className="mb-4 flex h-3 rounded-full bg-gray-100 text-xs">
            <div
              style={{ width: `${progress}%` }}
              className="rounded-full border border-white bg-secondary-700"
            ></div>
          </div>
          <div className="flex items-center justify-between text-lg">
            <div className="flex flex-row items-center space-x-2">
              <Image
                src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/XP.png`}
                width={20}
                height={20}
                alt="map"
              />
              <p>{xp} XP</p>
            </div>

            <div className="flex flex-row items-center space-x-1">
              <p>Level {level}</p>
              <Image
                src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/level.png`}
                width={25}
                height={25}
                alt="map"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-row items-center justify-between space-x-2 rounded-full border border-primary-200/30 px-5 py-1 text-xs md:text-lg">
        <div className="flex items-center gap-2">
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
          You need <br />
          <span className="font-bold text-secondary-600">
            {needMore} XP
          </span> to level up!
        </p>
      </div>

      <div className="mt-3 flex w-full flex-col-reverse items-center justify-between gap-5 rounded-xl border border-primary-200/30 p-3 sm:flex-row">
        <div className="flex h-full w-full flex-col items-center justify-between gap-5 sm:flex-row lg:flex-col xl:flex-row">
          <div className="flex flex-col items-center justify-center space-y-2">
            <QRCodeSVG
              value={user ? idToPid(user.id) : ""}
              size={130}
              bgColor="transparent"
              color="#ffffff"
              fgColor="#ffffff"
              className="h-32 w-32"
            />
            <span className={`text-xl text-[#fff] sm:text-2xl`}>
              {user ? idToPid(user.id) : ""}
            </span>

            <span className="flex items-center gap-x-2">
              <MdOutlineEmail />
              {user?.email}
            </span>
            <span className="flex items-center justify-center gap-x-2 sm:justify-start">
              <MdPhone />
              {user?.phoneNumber}
            </span>
          </div>
          <div className="space-y-2">
            <ViewUserAccommodation
              showModal={showModal}
              setShowModal={setShowModal}
            />
            {user?.college?.id !== "1" ? (
              loadingAccommodation ? (
                <Button
                  size={"large"}
                  onClick={() => setShowModal(true)}
                  className="bodyFont w-full justify-center !rounded-full !text-sm !tracking-normal"
                >
                  <Spinner size={"small"} className="text-[#dd5c6e]" />
                </Button>
              ) : dataAccommodation?.accommodationRequestsByUser[0]?.status ? (
                <Button
                  intent={"info"}
                  size={"large"}
                  onClick={() => setShowModal(true)}
                  className="bodyFont w-full justify-center !rounded-full !text-sm !tracking-normal"
                >
                  <RiHotelBedLine className="mr-1 inline-block" />
                  View Request
                </Button>
              ) : (
                <></>
              )
            ) : null}
            <Button
              onClick={() => router.push("/leaderboard")}
              className="bodyFont w-full justify-center !rounded-full !text-sm !tracking-normal"
              intent={"info"}
              size={"large"}
            >
              <FaAward className="mr-1 inline-block" />
              Leaderboard
            </Button>
            <Button
              onClick={() => signOut()}
              className="bodyFont w-full justify-center !rounded-full !text-sm !tracking-normal"
              intent={"danger"}
              size={"large"}
            >
              <FaSignOutAlt className="mr-1 inline-block" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
