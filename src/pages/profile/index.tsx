import { useMutation } from "@apollo/client";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { type HTMLAttributes, useEffect } from "react";
import toast from "react-hot-toast";
import { AddXpDocument, GetUserXpDocument, Role } from "~/generated/generated";
import Loader from "~/components/loader";
import { useAuth } from "~/hooks/useAuth";
import ProfileCard from "~/components/profile/ProfileCard";
import UserEvents from "~/components/profile/UserEvents";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { type NextPage } from "next";
import Image from "next/image";
import { env } from "~/env";
import Link from "next/link";
import LeaderBoard from "~/components/profile/LeaderBoard";
import { Button } from "~/components/button/button";
import { UserPen } from "lucide-react";
import AvatarModal from "~/components/profile/avatarModal";

const Profile: NextPage = () => {
  const { error, user: user, loading } = useAuth();
  const containerRef = useRef(null);
  const router = useRouter();
  const [bombXp, setBombXp] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false)
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

  if (loading) return <Loader />;

  if (!user)
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-3 text-center">
        {/* Todo: Any graphic to fill space */}
        <div className="z-10 mt-8 flex h-96 items-center justify-center">
          <Image
            src={`${env.NEXT_PUBLIC_UPLOADTHING_URL}/assets/png/gamer.png`}
            alt="404"
            width={400}
            height={400}
          />
        </div>
        <h1 className="-translate-y-10 text-lg text-white lg:text-xl">
          Hey there! You need to login to view your profile page.
        </h1>
        <Link href="/login" className="-translate-y-5">
          <Button className="md:text-lg text-base py-3 rounded-full">
            Login / Register
          </Button>
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
    );

    if(user.role === Role.User){
      void router.push("/register");
      return null;
    }

  return (
    <main
      ref={containerRef}
      className=" h-fit flex w-screen md:p-8 p-4 md:mb-8"
    >
      <div className="flex md:flex-row flex-col w-full mt-16 p-2 gap-8 h-full pb-8 relative">
        <div className="md:w-[30rem] w-full h-[85vh] rounded-lg overflow-hidden col-span-1 border-secondary-500/50 border-2 flex flex-col gap-0 md:sticky md:top-[10%]">
          <div className="w-full h-full relative">
            <AvatarModal showModal={showAvatarModal} setShowModal={setShowAvatarModal}/>
            <Button onClick={() => setShowAvatarModal(!showAvatarModal)} className="border-none size-10 rounded-md border-secondary-500 stroke-secondary-500 absolute top-5 left-5 z-50">
              <UserPen className="scale-[200%]"/>
            </Button>
            <ProfileCard user={user} showQR={showQr} />
          </div>
          <LeaderBoard
            isShowQr={showQr}
            setQr={() => {
              setShowQr(!showQr);
            }}
          />
        </div>

        {/* md:h-full h-[85vh] */}
        <div className="w-full  col-span-3">
          <UserEvents userId={user?.id} />
        </div>
      </div>
    </main>
  );
};

export default Profile;