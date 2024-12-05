import { useMutation } from "@apollo/client";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { env } from "~/env";
import { AddXpDocument, GetUserXpDocument } from "~/generated/generated";

const FinalComponent = () => {
  const [calledXp, setCalledXp] = useState(false);

  const [addXp] = useMutation(AddXpDocument, {
    variables: {
      levelId: "3",
    },
    refetchQueries: [GetUserXpDocument],
    awaitRefetchQueries: true,
  });

  const handleAddXp = async () => {
    if (calledXp) return;

    setCalledXp(true);
    await addXp().then((res) => {
      if (res.data?.addXP.__typename === "MutationAddXPSuccess") {
        toast.success(
          `Congratulations!!! You have found ${res.data?.addXP.data.level.point} Xp`,
          {
            position: "bottom-center",
            style: {
              backgroundColor: "#7628D0",
              color: "white",
            },
          },
        );
      }
    });
  };
  return (
    <div
      className="flex w-full flex-col items-center gap-y-4 text-white"
      id="animation"
    >
      <h1 className="text-5xl font-extrabold md:text-6xl">Incridea &apos;24</h1>
      <p className="text-sm tracking-wider md:text-xl">
        Its your time to create great memories
      </p>
      <Image
        src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/dice.png`}
        alt="dice"
        width={50}
        height={50}
        className="origin-center cursor-pointer hover:animate-shake"
        onClick={handleAddXp}
      ></Image>
    </div>
  );
};

export default FinalComponent;
