import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useState, useEffect } from "react";

import Button from "~/components/button";
import { GetUserXpDocument } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

import MainMenuModal from "./mainMenuModal";

export default function ExploreNav() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { data: userXp, loading: userXpLoading } = useQuery(
    GetUserXpDocument,
    {},
  );
  const [xp, setXp] = useState<number>(0);

  const handleOnEscapeDown = (e: KeyboardEvent) => {
    if (e.code === "Escape") setShowModal(!showModal);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleOnEscapeDown);
    return () => {
      window.removeEventListener("keydown", handleOnEscapeDown);
    };
  }, [showModal]);

  useEffect(() => {
    if (userXp?.getUserXp.__typename === "QueryGetUserXpSuccess") {
      setXp(
        userXp.getUserXp.data.reduce((acc, curr) => acc + curr.level.point, 0),
      );
    } else {
      setXp(0);
    }
  }, [userXpLoading]);

  return (
    <>
      <div className="fixed z-[1000] flex w-full items-center justify-between p-4">
        {user ? (
          <div className="titleFont flex flex-row items-center space-x-1 text-white">
            <Image
              src={"/assets/png/XP.png"}
              width={100}
              height={100}
              alt="map"
              className="h-8 w-8 sm:h-10 sm:w-10"
            />

            <p className="relative font-sans text-xl">{xp}</p>
          </div>
        ) : (
          <div></div>
        )}
        <Button
          intent={"primary"}
          size={"medium"}
          onClick={() => {
            setShowModal(true);
          }}
        >
          Menu
        </Button>
      </div>
      <MainMenuModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}
