import { useMutation } from "@apollo/client";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

import Button from "~/components/button";
import ProfileInfo from "~/components/general/profile/profileInfo";
import UserEvents from "~/components/general/profile/registeredEvents";
import Loader from "~/components/loader";
import { env } from "~/env";
import { AddXpDocument, GetUserXpDocument } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

const Profile: NextPage = () => {
  const { error, user, loading } = useAuth();
  const containerRef = useRef(null);
  const router = useRouter();
  const [bombXp, setBombXp] = useState<boolean>(false);
  const [addXp] = useMutation(AddXpDocument, {
    variables: {
      levelId: "2",
    },
    refetchQueries: [GetUserXpDocument],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (router.isReady) {
      setBombXp(localStorage.getItem("easterBombClicked") === "true");
    }
  }, [router.isReady]);

  useEffect(() => {
    if (bombXp) {
      void addXp().then((res) => {
        if (res.data?.addXP.__typename === "MutationAddXPSuccess") {
          toast.success(
            `Congratulations!! Added ${res.data?.addXP.data.level.point} Easter Bomb XP`,
            {
              position: "bottom-center",
              style: {
                backgroundColor: "#7628D0",
                color: "white",
              },
            },
          );
          localStorage.removeItem("easterBombClicked");
        }
      });
    }
  }, [addXp, bombXp]);

  if (loading) return <Loader />; // Todo: Loading page here

  if (!user)
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-3 bg-gradient-to-b from-primary-300 to-primary-500 text-center">
        {/* Todo: Any graphic to fill space */}
        <div className="z-10 mt-8 flex h-96 items-center justify-center">
          <Image
            src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/gamer.png`}
            alt="404"
            width={400}
            height={400}
          />
        </div>
        <h1 className="bodyFont -translate-y-10 text-lg text-white lg:text-xl">
          Hey there! You need to login to view your profile page.
        </h1>
        <Link href="/login" className="-translate-y-5">
          <Button intent={"primary"}>Login / Register</Button>
        </Link>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-primary-300 to-primary-500">
        <h1 className="text-2xl font-bold text-white">
          Something went wrong. Please try again later.
        </h1>
      </div>
    ); // Error page here

  return (
    <main ref={containerRef} className="bodyFont mx-auto w-[98vw]">
      <div className="flex flex-col-reverse gap-5 py-[5rem] lg:grid lg:grid-cols-3">
        <div className="col-span-2 h-full w-full overflow-auto">
          <UserEvents userId={user?.id} />
        </div>

        <div className="w-full rounded-xl">
          <ProfileInfo user={user} />
        </div>
      </div>
    </main>
  );
};

export default Profile;
