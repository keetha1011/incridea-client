import { NextPage } from "next";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

import ValedictoryTab from "~/components/general/dashboard/valedictory/ValedictoryTab";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import { useAuth } from "~/hooks/useAuth";

const Valedictory: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    );

  // 1. Redirect to login if user is not logged in
  if (!user) {
    router.push("/login");
    return <div>Redirecting...</div>;
  }

  // 2. Redirect to profile if user is not a admin
  if (user && user.role !== "JURY") router.push("/profile");

  return (
    <Dashboard>
      <Toaster />
      {/* Welcome Header */}
      <h1 className="mb-3 text-4xl">
        Welcome <span className="font-semibold">{user?.name}</span>!
      </h1>
      <div className="mt-3">
        <ValedictoryTab />
      </div>
    </Dashboard>
  );
};

export default Valedictory;
