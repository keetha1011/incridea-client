import { useMutation, useQuery } from "@apollo/client";
import { Combobox, Transition } from "@headlessui/react";
import Link from "next/link";
import {
  useState,
  type FormEventHandler,
  type FunctionComponent,
  Fragment,
} from "react";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { BsChevronExpand } from "react-icons/bs";

import {Button} from "~/components/button/button";
import Spinner from "~/components/spinner";
import { CONSTANT } from "~/constants";
import {
  CollegesDocument,
  EmailVerificationDocument,
  SignUpDocument,
} from "~/generated/generated";

type SignUpFormProps = {
  setWhichForm: (
    whichForm: "signIn" | "resetPassword" | "signUp" | "resendEmail",
  ) => void;
  setGotDialogBox: (gotDialogBox: boolean) => void;
};

const SignUpForm: FunctionComponent<SignUpFormProps> = ({
  setWhichForm,
  setGotDialogBox,
}) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    college: "",
    email: "",
    password: "",
    phoneNumber: "",
    accepted: false,
  });
  const [error, setError] = useState("");
  const [verifyError, setVerifyError] = useState(false);

  const [emailSuccess, setEmailSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [signUpMutation, { loading, error: mutationError }] =
    useMutation(SignUpDocument);

  if (mutationError) setGotDialogBox(false);

  const [
    emailVerificationMutation,
    { loading: emailVerificationLoading, error: emailVerificationError },
  ] = useMutation(EmailVerificationDocument);

  if (emailVerificationError) setGotDialogBox(true);

  const { data: collegeData, loading: collegesLoading } =
    useQuery(CollegesDocument);

  if (emailVerificationError) setGotDialogBox(true);

  const sortColleges = () => {
    if (collegeData?.colleges.__typename !== "QueryCollegesSuccess") return [];

    const nmamit = collegeData.colleges.data.find(
      (college) => college.name === CONSTANT.COLLEGE_NAME,
    );
    const other = collegeData.colleges.data.find(
      (college) => college.name === "Other",
    );
    const sortedColleges = [...(collegeData.colleges.data ?? [])]
      .filter((college) => {
        return (
          college.name !== CONSTANT.COLLEGE_NAME &&
          college.name !== "Other"
        );
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    return [nmamit, ...sortedColleges, other];
  };

  const sortedColleges = sortColleges();

  const [selectedCollege, setSelectedCollege] = useState<{
    name: string;
    id: string;
  } | null>({
    name: "",
    id: "",
  });

  const [query, setQuery] = useState("");

  const filteredColleges =
    query === ""
      ? sortedColleges
      : sortedColleges?.filter((college) => {
        return college?.name
          .toLowerCase()
          .replace(/[.,\s]/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""));
      });

  const resendEmail = async () => {
    setEmailSuccess(false);
    await emailVerificationMutation({
      variables: {
        email: userInfo.email,
      },
    }).then((res) => {
      if (res.data?.sendEmailVerification.__typename === "Error") {
        setError(res.data.sendEmailVerification.message);
        setGotDialogBox(true);
      } else {
        setEmailSuccess(true);
        setGotDialogBox(true);
      }
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setVerifyError(false);
    setError("");

    if (
      !userInfo.name ||
      !userInfo.email ||
      !userInfo.password ||
      !userInfo.phoneNumber ||
      !userInfo.college
    ) {
      setError("Please fill all the fields");
      return;
    }

    if (selectedCollege?.name === CONSTANT.COLLEGE_NAME) {
      if (userInfo.email.split("@").length > 1) {
        setError('Please only enter your USN without "@nmamit.in"');
        return;
      }
    }

    if (
      userInfo.phoneNumber.length !== 10 ||
      isNaN(Number(userInfo.phoneNumber))
    ) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (userInfo.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    signUpMutation({
      variables: {
        name: userInfo.name,
        email:
          selectedCollege?.name === CONSTANT.COLLEGE_NAME
            ? `${userInfo.email.trim()}@nmamit.in`
            : userInfo.email,
        password: userInfo.password,
        phoneNumber: userInfo.phoneNumber.trim(),
        collegeId: Number(userInfo.college),
      },
    })
      .then(async (res) => {
        if (res.data?.signUp.__typename === "MutationSignUpSuccess") {
          await emailVerificationMutation({
            variables: {
              email:
                selectedCollege?.name === CONSTANT.COLLEGE_NAME
                  ? `${userInfo.email}@nmamit.in`
                  : userInfo.email,
            },
          }).then((res) => {
            if (res.data?.sendEmailVerification.__typename === "Error") {
              setError(res.data.sendEmailVerification.message);
              setGotDialogBox(true);
            }

            if (
              res.data?.sendEmailVerification.__typename ===
              "MutationSendEmailVerificationSuccess"
            ) {
              setEmailSuccess(true);
              setGotDialogBox(true);
            }
          });
        }

        if (res.data?.signUp.__typename === "Error") {
          setError(res.data.signUp.message);
          if (res.data.signUp.message.includes("verify")) setVerifyError(true);
          setGotDialogBox(true);
        }
      })
      .catch(console.log);
  };

  // NOTE: change handler for all fields except college
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setError("");
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex min-h-full flex-col justify-center gap-3 px-3 py-3 ${loading && "pointer-events-none cursor-not-allowed"
        }`}
    >
      <p className="mb-2 text-center text-2xl font-semibold">
        Welcome Time Traveler
      </p>

      {!emailSuccess && (
        <>
          <input
            value={userInfo.name}
            onChange={handleChange}
            name="name"
            type="text"
            required
            className={`${selectedCollege?.name === "Other" ? "mt-2" : "mt-2"
              } border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white md:text-base md:focus:border-[#dd5c6e]`}
            placeholder="Name"
          />

          <Combobox
            value={selectedCollege}
            onChange={(value) => {
              setUserInfo((prev) => ({
                ...prev,
                college: value?.id ?? "",
              }));
              setSelectedCollege(value);
            }}
          >
            <div className="relative">
              <div className="relative w-full cursor-default overflow-hidden border-b border-gray-400 md:focus-within:border-[#dd5c6e] md:focus:border-[#dd5c6e]">
                <Combobox.Input
                  required
                  placeholder="College"
                  displayValue={(college: { name: string }) => college.name}
                  className="w-full bg-transparent py-2 pl-1 pr-10 text-sm outline-none placeholder:text-white md:text-base"
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <BsChevronExpand
                    className="h-5 w-5 text-gray-100 md:text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {collegesLoading ? (
                    <div className="select-none px-4 py-2 text-center italic">
                      <Spinner
                        className="text-[#dd5c6e]"
                        size={"small"}
                        intent={"primary"}
                      />
                    </div>
                  ) : filteredColleges?.length === 0 && query !== "" ? (
                    //FIXME no need to touch
                    <div className="relative select-none px-4 py-2 text-xs font-semibold text-gray-600 md:text-base">
                      College not found. Please{" "}
                      <Link
                        href="/contact"
                        className="cursor-pointer underline hover:text-gray-700"
                      >
                        contact admin.
                      </Link>
                    </div>
                  ) : (
                    filteredColleges?.map((college) => (
                      <Combobox.Option
                        className={({ active }) =>
                          `relative cursor-pointer select-none px-4 py-2 text-xs md:text-base ${active
                            ? "bg-secondary-600 text-white"
                            : "text-gray-900"
                          }`
                        }
                        key={college?.id}
                        value={college}
                      >
                        {college?.name}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>

          {selectedCollege?.name === "Other" && (
            <div className="flex items-center gap-3 rounded-md bg-blue-100 p-2 px-4 font-semibold text-blue-500">
              <AiOutlineInfoCircle className="shrink-0" />
              <div>
                <a className="inline-block text-start text-sm font-normal text-blue-500 transition-colors">
                  This option is exclusively for invited participants without
                  access to pronites. If your college is not in the list above
                  and you are not invited, please{" "}
                  <Link
                    href="/contact"
                    className="cursor-pointer underline hover:text-blue-700"
                  >
                    contact us
                  </Link>
                  . Refer to the{" "}
                  <Link
                    href="/guidelines"
                    className="cursor-pointer underline hover:text-blue-700"
                  >
                    Guidelines
                  </Link>{" "}
                  page for more details.
                </a>
              </div>
            </div>
          )}

          <div className="relative">
            <input
              value={userInfo.email}
              onChange={handleChange}
              name="email"
              required
              className={`${selectedCollege?.name == CONSTANT.COLLEGE_NAME &&
                "pr-28"
                } w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white md:text-base md:focus:border-[#dd5c6e]`}
              placeholder="Email"
            />
            {selectedCollege?.name === CONSTANT.COLLEGE_NAME && (
              <span className="absolute right-0 top-0 mr-3 mt-2">
                @nmamit.in
              </span>
            )}
          </div>
          <div className="relative">
            <input
              value={userInfo.password}
              onChange={handleChange}
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white md:text-base md:focus:border-[#dd5c6e]"
            />
            <button
              type="button"
              className="absolute right-0 top-0 mt-2 w-fit rounded-sm p-2 hover:bg-orange-500 hover:bg-opacity-10"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          <input
            value={userInfo.phoneNumber}
            onChange={handleChange}
            name="phoneNumber"
            type="text"
            required
            placeholder="Mobile"
            className="border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white md:text-base md:focus:border-[#dd5c6e]"
          />

          <div className="flex">
            <input
              required
              type="checkbox"
              className="mr-2"
              checked={userInfo.accepted}
              id="termsCheckbox"
              onChange={() =>
                setUserInfo((prev) => ({
                  ...prev,
                  accepted: !prev.accepted,
                }))
              }
            />
            <label htmlFor="termsCheckbox">
              <span className="text-xs text-white md:text-base lg:text-sm">
                I agree to all the{" "}
                <Link
                  href="/rules"
                  className="cursor-pointer underline hover:text-slate-100"
                >
                  T&C
                </Link>{" "}
                and{" "}
                <Link
                  href="/guidelines"
                  className="cursor-pointer underline hover:text-slate-100"
                >
                  Guidelines
                </Link>{" "}
              </span>
            </label>
          </div>

          <Button className="mt-3 font-life-craft text-lg tracking-widest">Sign Up</Button>
        </>
      )}

      {(error ?? mutationError ?? emailVerificationError) && (
        <div className="flex min-w-full items-center gap-3 overflow-x-auto rounded-md bg-primary-900/70 p-2 px-4 font-semibold text-red-500">
          <BiErrorCircle className="shrink-0" />
          <div>
            {error}
            {verifyError && (
              <button
                type="button"
                onClick={() => setWhichForm("resendEmail")}
                className="inline-block text-start text-sm font-normal text-red-500 underline transition-colors hover:text-red-700"
              >
                Click here to resend verification email
              </button>
            )}
          </div>
        </div>
      )}

      {emailSuccess && (
        <div className="flex flex-col items-center gap-3 rounded-md bg-primary-900/70 p-4 text-center font-semibold text-secondary-600">
          <div>
            Verification email sent to {userInfo.email}
            {selectedCollege?.name === CONSTANT.COLLEGE_NAME &&
              "@nmamit.in"}
            <br />
            Please check your inbox.
            <hr className="mx-3 my-2 border-secondary-600" />
            <div className="text-sm font-normal">
              <p>Didn&apos;t receive the email?</p>
              <p>Make sure to check your spam folder.</p>
              <button
                type="button"
                onClick={resendEmail}
                className="text-sm font-normal text-secondary-400 underline transition-colors hover:font-medium"
              >
                Click here to resend it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mt-2 flex flex-col text-center">
        <hr className="my-3 border-accent-50" />
        <h4 className="absolute right-1/2 top-0.5 mx-auto w-max translate-x-1/2 rounded-full bg-accent-900/90 px-3 text-sm text-accent-50 md:px-2">
          Already have an account?
        </h4>
        <Button
          variant={"ghost"}
          onClick={() => {
            setWhichForm("signIn");
          }}
          type="button"
          className="mt-4 font-life-craft text-lg tracking-widest"
        >
          Sign in instead
        </Button>
      </div>

      {(loading || emailVerificationLoading) && (
        <div className="absolute inset-0 z-10 flex h-full w-full cursor-not-allowed flex-col items-center justify-center gap-4 rounded-lg opacity-60">
          <Spinner className="my-0 h-fit text-[#dd5c6e]" intent={"primary"} />
          {emailVerificationLoading && (
            <p className="font-semibold">Sending Verification Email</p>
          )}
        </div>
      )}
    </form>
  );
};
export default SignUpForm;
