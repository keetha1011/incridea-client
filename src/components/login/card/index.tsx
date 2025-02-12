import { useRouter } from "next/router";
import React, { type FunctionComponent, useEffect, useState } from "react";

import { type CardStyle } from "~/pages/login";

import ResendEmail from "~/components/form/login/resendEmailForm";
import ResetPasswordForm from "~/components/form/login/resetPasswordForm";
import SignInForm from "~/components/form/login/signInForm";
import SignUpForm from "~/components/form/signUp";

type LoginCardProps = {
  whichForm: "signIn" | "resetPassword" | "signUp" | "resendEmail";
  cardStyle: CardStyle;
  setWhichForm: (
    whichForm: "signIn" | "resetPassword" | "signUp" | "resendEmail",
  ) => void;
  redirectUrl?: string;
};

const LoginCard: FunctionComponent<LoginCardProps> = ({
  whichForm,
  cardStyle,
  setWhichForm,
  redirectUrl,
}) => {
  const [gotDialogBox, setGotDialogBox] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  // useEffect(() => {
  //   if (cardStyle.top === "-50%" && gotDialogBox) {
  //     // Work around to remove error and success dialog box from card when card is re-bought into viewport
  //     // % 10 is to control overflow [which will never happen]
  //     setCount((prev) => (prev + 1) % 10);
  //     setGotDialogBox(false);
  //   }
  // }, [cardStyle.top, gotDialogBox]);

  const router = useRouter();
  const { verify } = router.query;

  useEffect(() => {
    if (verify) setWhichForm("signIn");
  }, [verify, setWhichForm]);

  return (
    // HACK: Please update anything here or in children also in auth/reset-password.tsx
    <div
      className="size-full absolute top-0 left-0 origin-center "
      style={{ ...cardStyle }}
    >
      <div className="relative size-full">
        <div className="absolute left-2/4 top-0 -translate-x-2/4 min-w-[80vw] max-w-[80vw] overflow-y-auto rounded-xl px-3 py-3 text-accent-100 transition-all ease-in-out sm:min-w-[350px] sm:max-w-[350px]  bg-gradient-to-br from-green-800/95 to-green-700/80">
          {whichForm === "signIn" ? (
            <SignInForm
              redirectUrl={redirectUrl}
              setWhichForm={setWhichForm}
              setGotDialogBox={setGotDialogBox}
              key={count}
            />
          ) : whichForm === "resetPassword" ? (
            <ResetPasswordForm
              setWhichForm={setWhichForm}
              setGotDialogBox={setGotDialogBox}
              key={count}
            />
          ) : whichForm === "signUp" ? (
            <SignUpForm
              setWhichForm={setWhichForm}
              setGotDialogBox={setGotDialogBox}
              key={count}
            />
          ) : (
            <ResendEmail
              setWhichForm={setWhichForm}
              setGotDialogBox={setGotDialogBox}
              key={count}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
