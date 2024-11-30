import { useQuery } from "@apollo/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

import AccommodateTab from "~/components/general/dashboard/accommodate/accomodateTab";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import { AccommodationRequestsDocument } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

const Accommodate: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const {
    data,
    loading: submissionsLoading,
    error,
    refetch: submissionsRefetch,
  } = useQuery(AccommodationRequestsDocument);

  if (loading)
    return (
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    );

  // 1. Redirect to login if user is not logged in
  if (!user) {
    void router.push("/login");
    return <div>Redirecting...</div>;
  }

  // 2. Redirect to profile if user is not a admin
  // if (user && user.role !== 'ADMIN') router.push('/profile');
  // 2. Redirect to profile if user is not a accommodation committee member
  if (data?.accommodationRequests.__typename === "Error")
    void router.push("/profile");

  return (
    <Dashboard>
      <Toaster />
      {/* Welcome Header */}
      <h1 className="mb-3 text-4xl">
        Welcome <span className="font-semibold">{user?.name}</span>!
      </h1>
      <div className="mt-3">
        <AccommodateTab />
      </div>
    </Dashboard>
  );
};

export default Accommodate;
