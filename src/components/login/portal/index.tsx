import Image from "next/image";
import React, { FunctionComponent } from "react";

import { env } from "~/env";

type LoginPortalProps = {
  isTop: boolean;
};

const LoginPortal: FunctionComponent<LoginPortalProps> = ({ isTop }) => {
  return (
    <>
      <div
        className={`pointer-events-none absolute left-2/4 ${
          isTop ? "-top-[25px]" : "-bottom-[20px]"
        } z-50 h-[110px] w-[115vw] -translate-x-2/4 md:w-[750px]`}
      >
        <Image
          fill={true}
          src={
            isTop
              ? `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/loginPortalT.png`
              : `${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/loginPortalB.png`
          }
          alt={"portal"}
          className="pointer-events-none"
          priority
        />
      </div>

      <div
        className={`absolute left-2/4 ${
          isTop ? "-top-[25px]" : "-bottom-[20px]"
        } pointer-events-none z-40 h-[50px] w-[75vw] -translate-x-2/4 backdrop-blur-[100px] md:w-[450px]`}
      ></div>

      <div
        className={`pointer-events-none absolute left-2/4 ${
          isTop ? "-top-[25px]" : "-bottom-[20px]"
        } -z-50 h-[110px] w-[115vw] -translate-x-2/4 md:w-[750px]`}
      >
        <Image
          fill={true}
          src={
            !isTop
              ? "/assets/png/loginPortalT.png"
              : "/assets/png/loginPortalB.png"
          }
          alt={"portal"}
          className="pointer-events-none"
          priority
        />
      </div>
    </>
  );
};

export default LoginPortal;
