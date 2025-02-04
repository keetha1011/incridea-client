import React from "react";
import Dashboard from "~/components/layout/dashboard";
import RevenueCard from "~/components/general/dashboard/analytics/getRevenue";
import RegistrationCard from "~/components/general/dashboard/analytics/registrationsCard";
import ProniteRegistrationCard from "~/components/general/dashboard/analytics/proniteCard";
import Leaderboard from "~/components/general/dashboard/analytics/championshipCard";
import EventStatusCard from "~/components/general/dashboard/analytics/eventStatusCard";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth } from "~/hooks/useAuth";
import Spinner from "~/components/spinner";
import { Role } from "~/generated/generated";

const Analytics: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    );
  if (!user) {
    void router.push("/login");
    return <div>Redirecting...</div>;
  }
  if (user.role !== Role.Admin && user.role !== Role.Jury) {
    void router.push("/profile");
    return null;
  }

  if (user && user.role !== Role.Admin && user.role !== Role.Jury) return <></>;

  return (
    <Dashboard>
      <div className="p-2">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <RevenueCard />
          <RegistrationCard />
          <ProniteRegistrationCard />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="hidden md:block col-span-2">
            <Leaderboard />
          </div>
          <div className="col-span-2 md:col-span-1">
            <EventStatusCard />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Analytics;
