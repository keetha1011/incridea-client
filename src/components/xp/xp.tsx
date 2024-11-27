import { useMutation } from "@apollo/client";
import React from "react";
import toast from "react-hot-toast";

import { AddXpDocument } from "~/generated/generated";

interface XpProps {
  children: React.ReactNode;
  levelId: string;
}

const Xp = ({ children, levelId }: XpProps) => {
  const [addXp] = useMutation(AddXpDocument, {
    variables: {
      levelId: levelId,
    },
  });

  const handleAddXp = () => {
    console.log("add xp");
    const promise = addXp().then((res) => {
      if (res.data?.addXP.__typename === "MutationAddXPSuccess") {
        toast.success(
          `Congratulations!! Added ${res.data?.addXP.data.level.point} Xp`,
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

  return <div onClick={handleAddXp}>{children}</div>;
};

export default Xp;
