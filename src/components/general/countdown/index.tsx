import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import GlitchAnimation from "~/components/animation/glitchAnimation";
import { env } from "~/env";
import { GetUserXpDocument, Role } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

export default function CountDown() {
  const { user } = useAuth();
  const [userAuthStatus, setUserAuthStatus] = useState<boolean>(false);
  const { data: userXp, loading: userXpLoading } = useQuery(
    GetUserXpDocument,
    {},
  );

  useEffect(() => {
    if (user && user.role !== Role.User) setUserAuthStatus(true);
    else setUserAuthStatus(false);
  }, [user]);

  const [xp, setXp] = useState<number>(0);

  useEffect(() => {
    if (userXp?.getUserXp.__typename === "QueryGetUserXpSuccess")
      setXp(
        userXp.getUserXp.data.reduce((acc, curr) => acc + curr.level.point, 0),
      );
    else setXp(0);
  }, [userXpLoading, userXp]);

  const [time, setTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  function getRemaingTime() {
    const eventDate = new Date("2024-02-22T09:00:00").getTime();
    const currentDate = new Date().getTime();
    const remainingTime = eventDate - currentDate;

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60),
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    setTime({ days, hours, minutes, seconds });
  }

  useEffect(() => {
    getRemaingTime();
    const interval = setInterval(() => {
      getRemaingTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed z-50 flex w-full items-center justify-between p-2 md:p-4">
      {userAuthStatus ? (
        <div>
          <Link href="/leaderboard">
            <h3
              className={`z-10 text-lg tracking-widest text-white md:text-2xl`}
            >
              <div className="flex flex-row items-center space-x-2">
                <Image
                  src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/XP.png`}
                  width={100}
                  height={100}
                  alt="map"
                  className="h-10 w-8 sm:h-12 sm:w-10"
                />

                <p className="relative font-sans">{xp}</p>
              </div>
            </h3>
          </Link>
        </div>
      ) : (
        <div></div>
      )}

      <div className="flex flex-col items-center justify-center text-white">
        <GlitchAnimation text="" />
        <GlitchAnimation
          text={`${time.days < 10 ? `0${time.days}` : time.days}d :${" "}
            ${time.hours < 10 ? `0${time.hours}` : time.hours}h :${" "}
            ${time.minutes < 10 ? `0${time.minutes}` : time.minutes}m :${" "}
            ${time.seconds < 10 ? `0${time.seconds}` : time.seconds}s`}
        />
      </div>
    </div>
  );
}
