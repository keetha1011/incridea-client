import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FormEventHandler, type FunctionComponent, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
import { ResetPasswordDocument } from "~/generated/generated";

const ResetPassword: FunctionComponent = () => {
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const token = useRouter().query.token as string | undefined;

  const [resetMutation, { data, loading, error: MutationError }] = useMutation(
    ResetPasswordDocument,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (password.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid token");
      return;
    }

    resetMutation({
      variables: {
        password: password.newPassword,
        token: token,
      },
    })
      .then((res) => {
        if (res.data?.resetPassword.__typename === "Error") {
          setError(res.data.resetPassword.message);
        }
      })
      .catch(console.log);
  };

  return (
    <>
      {data?.resetPassword.__typename === "MutationResetPasswordSuccess" ? (
        <div className="size-full absolute top-0 left-0 origin-center ">
          <div className="relative size-full">
            <div className="absolute left-2/4 top-0 -translate-x-2/4 max-h-[75vh] min-w-[80vw] max-w-[80vw] overflow-y-auto rounded-xl text-accent-200 transition-all ease-in-out sm:min-w-[350px] sm:max-w-[350px]  lg:max-h-[76vh] bg-black/80 justify-center gap-4 px-7 py-9">
              <div className="flex flex-col items-center gap-2 rounded-md bg-secondary-300 p-4 pb-2 text-center font-semibold text-[#d7037f]">
                <BiCheckCircle size={"2rem"} />
                <div className="mb-5 flex flex-col items-center gap-3 rounded-md bg-secondary-300 text-center font-semibold">
                  Password was reset successfully.
                  <br />
                  <div>
                    Please{" "}
                    <Link
                      href="/login"
                      className="text-secondary-800 underline hover:text-[#ee007d]"
                    >
                      login.
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="size-full absolute top-0 left-0 origin-center ">
          <div className="relative size-full">
            <form
              className={`absolute left-2/4 top-0 -translate-x-2/4 max-h-[75vh] min-w-[80vw] max-w-[80vw] overflow-y-auto rounded-xl text-accent-200 transition-all ease-in-out sm:min-w-[350px] sm:max-w-[350px]  lg:max-h-[76vh] bg-black/80 justify-center gap-4 px-12 py-12 ${
                loading && "pointer-events-none cursor-not-allowed"
              }`}
              onSubmit={handleSubmit}
            >
              <h2 className="mb-5 text-center text-3xl font-semibold">
                Enter New Password
              </h2>

              <div className="relative">
                <input
                  required
                  value={password.newPassword}
                  onChange={({ target }) =>
                    setPassword({ ...password, newPassword: target.value })
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  className="w-full border-b border-gray-400 bg-transparent px-1 py-2 text-md outline-none transition-all placeholder:text-slate-400 md:text-base md:focus:border-[#dd5c6e]"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 mt-2 w-fit rounded-sm p-2 hover:bg-orange-500 hover:bg-opacity-10"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>

              <div className="relative">
                <input
                  required
                  value={password.confirmPassword}
                  onChange={({ target }) =>
                    setPassword({ ...password, confirmPassword: target.value })
                  }
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="mb-3 w-full border-b border-gray-400 bg-transparent px-1 py-2 text-md outline-none transition-all placeholder:text-slate-400 md:text-base md:focus:border-[#dd5c6e]"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 mt-2 w-fit rounded-sm p-2 hover:bg-orange-500 hover:bg-opacity-10"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>

              <Button intent={`primary`} type="submit" className="mx-1 mt-1">
                Reset Password
              </Button>

              {loading && (
                <div className="absolute inset-0 z-10 h-full w-full cursor-not-allowed rounded-lg bg-gradient-to-b from-[#1f2e97] to-[#090d4b] opacity-60">
                  <Spinner className="text-[#dd5c6e]" intent={"white"} />
                </div>
              )}

              {(error ?? MutationError) && (
                <div className="flex items-center gap-3 rounded-md bg-red-100 p-2 px-4 font-semibold text-red-500">
                  <BiErrorCircle className="shrink-0" />
                  <div>{error ?? MutationError?.message}</div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
