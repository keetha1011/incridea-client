import { useMutation } from "@apollo/client";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { type HTMLAttributes, useEffect } from "react";
import toast from "react-hot-toast";
import { AddXpDocument, GetUserXpDocument } from "~/generated/generated";
import Loader from "~/components/loader";
import { useAuth } from "~/hooks/useAuth";
import ProfileCard from "./ProfileCard";
import UserEvents from "~/components/profile/UserEvents";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { type NextPage } from "next";
import Image from "next/image";
import { env } from "~/env";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { signOut } from "next-auth/react";

const Profile: NextPage = () => {
  const { error, user: user, loading } = useAuth();
  const containerRef = useRef(null);
  const router = useRouter();
  const [bombXp, setBombXp] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);
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
          <Button>Login / Register</Button>
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

  return (
    <main
      ref={containerRef}
      className="bodyFont md:h-screen h-fit flex w-screen md:p-8 p-2 pb-8 md:mb-8"
    >
      <div className="flex md:flex-row flex-col w-full mt-16 p-2 gap-8">
        <div className="md:w-[30rem] w-full md:h-full h-[80vh] rounded-lg overflow-hidden col-span-1 border-secondary-500/50 border-2 flex flex-col">
          <div className="w-full h-full">
            <ProfileCard user={user} showQR={showQr} />
          </div>
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-2 md:grid-cols-2 p-2">
            <Button onClick={() => setShowQr((s) => !s)}>
              {showQr ? "Show details" : "show QR"}
            </Button>
            <Button
              onClick={async () => {
                await signOut();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
        <div className="w-full md:h-full h-[85vh] col-span-3">
          <UserEvents userId={user?.id} />
        </div>
      </div>
    </main>
  );
};

export default Profile;

function Button({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        className,
        "-skew-x-12 mx-1 px-4 py-2 bg-[#D79128] text-white font-bold rounded-md shadow-md hover:bg-yellow-500",
      )}
    >
      {children}
    </button>
  );
}
