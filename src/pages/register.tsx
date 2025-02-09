import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import Button from "~/components/button";
import ViewUserAccommodation from "~/components/general/profile/viewUserAccommodation";
import Loader from "~/components/loader";
import { Role } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

const Register: NextPage = () => {
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);

  if (userLoading) return <Loader />;
  if (!user) void router.push("/login");
  if (user && user?.role !== Role.User) void router.push("/profile");

  return (
    <div className="min-h-screen pb-10 pt-32 text-white md:px-6">
      <ViewUserAccommodation
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <div className="mx-auto max-w-4xl">
        <h2 className={`titleFont text-center text-4xl text-white md:text-5xl`}>
          Register
        </h2>

        <h5 className="bodyFont mx-auto mt-5 max-w-7xl text-center text-base md:mt-7 md:text-xl">
          Before you roll the dice, read through the list of T&C, and register
          yourself for the fest by clicking the button below.
        </h5>
        <div className="bodyFont mx-auto mt-6 max-w-7xl rounded-sm bg-white/20 px-5 py-4 md:mt-8 md:px-10 md:py-7">
          <h2 className="text-base font-semibold md:text-2xl">
            Terms and Conditions
          </h2>
          <p className="mt-2">
            Two different categories of participants are permitted to
            participate:
          </p>
          <ol className="mt-2 list-decimal pl-4">
            <li>
              {" "}
              Students of NMAM Institute of Technology, who pays{" "}
              <span className="font-semibold">₹256</span> will have access to
              all events and pronites
            </li>
            <li>
              {" "}
              Students of external engineering and sister Nitte colleges, who
              pays <span className="font-semibold">₹356</span> will have access
              to all events and pronites.
            </li>
          </ol>
          <div className="mt-2">
            <Link
              className="underline hover:text-gray-300"
              href={"/guidelines"}
            >
              Read More
            </Link>{" "}
            about the guidelines and regulations
          </div>
          <Button disabled className="disabled mb-4 mt-8 flex gap-2">
            Register Now
          </Button>
          <h2 className="mt-2 text-xs text-gray-100 md:text-sm">
            Registration are closed.
          </h2>
          <h1 className="mt-2 text-xs text-gray-100 md:text-sm">
            By clicking the above button, you agree to the mentioned terms and
            conditions
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Register;
