import { type NextPage } from "next";
import Image from "next/image";

import ResetPassword from "~/components/form/resetPassword";
import LoginPortal from "~/components/login/portal";
import { env } from "~/env";

const Reset: NextPage = () => {
  return (
    <>
      <div className="h-16 bg-[#6a5fd7]"></div>

      <Image
        fill={true}
        className="mt-16 object-cover"
        src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/svg/loginBG.svg`}
        alt={"loginBG"}
        quality={100}
        priority
      />

      <div
        className={`relative flex min-h-[93vh] flex-col justify-between overflow-hidden [perspective:500px] [transform-style:preserve-3d]`}
      >
        <LoginPortal isTop={true} />

        <div className="absolute left-2/4 top-2/4 max-h-[75vh] min-w-[80vw] max-w-[80vw] origin-bottom -translate-x-2/4 -translate-y-2/4 overflow-y-auto rounded-md bg-gradient-to-b from-[#1f2e97] to-[#090d4b] px-3 py-3 text-accent-200 shadow-[0_0_18px_1px_#141e73] transition-all ease-suck-in sm:min-w-[350px] sm:max-w-[350px] md:shadow-[0_0_20px_2px_#141e73] lg:max-h-[76vh]">
          <div className={`flex shrink-0 items-center justify-center`}>
            <div className="grow p-3 py-5">
              <ResetPassword />
            </div>
          </div>
        </div>

        <LoginPortal isTop={false} />
      </div>
    </>
  );
};

export default Reset;
