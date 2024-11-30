import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent, useState, useEffect } from "react";
import { GiConfirmed } from "react-icons/gi";
import { MdError } from "react-icons/md";

import Spinner from "~/components/spinner";
import { VerifyEmailDocument } from "~/generated/generated";

const VerifyEmailComponent: FunctionComponent = () => {
  const [error, setError] = useState<string | null>(null);
  const [isMutationExecuted, setIsMutationExecuted] = useState<boolean>(false);

  const token = useRouter().query.token as string | undefined;

  const [verifyMutation, { data, loading }] = useMutation(VerifyEmailDocument);

  useEffect(() => {
    if (token && !isMutationExecuted) {
      setIsMutationExecuted(true);
      void verifyMutation({ variables: { token } }).then((res) => {
        if (res.data?.verifyEmail.__typename === "Error") {
          setError(res.data.verifyEmail.message);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isMutationExecuted]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-bl from-[#6841b0] to-[#0a0e4d]">
      {loading && <Spinner intent={"white"} className="text-[#dd5c6e]" />}
      {!token && (
        <div className="flex min-w-[300px] flex-col items-center justify-center rounded-md bg-[#dd5c6e]/90 p-12 text-red-800">
          <MdError className="mx-auto my-6 text-7xl" />
          <h1>No token provided</h1>
        </div>
      )}
      {error && (
        <div className="flex min-w-[300px] flex-col items-center justify-center rounded-md bg-[#dd5c6e]/90 p-12 text-red-800">
          <MdError className="mx-auto my-6 text-7xl text-red-600" />
          <h1>{error}</h1>
        </div>
      )}
      {data?.verifyEmail.__typename === "MutationVerifyEmailSuccess" && (
        <div className="rounded-md bg-secondary-300 p-12 text-center text-[#d7037f]">
          <GiConfirmed className="mx-auto my-6 text-7xl" />
          <h1>Your email has been verified.</h1>
          <p>You can now login to your account.</p>
          <Link
            href={"/login?verify=true"}
            className="text-secondary-800 underline hover:text-[#ee007d]"
          >
            Click here to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailComponent;
