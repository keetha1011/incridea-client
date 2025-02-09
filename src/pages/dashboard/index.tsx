import { useRouter } from "next/router";
import { Role } from "~/generated/generated";
import { AuthStatus, useAuth } from "~/hooks/useAuth";

const Page = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  if (status === AuthStatus.LOADING) return <div>Loading...</div>;

  if (status !== AuthStatus.AUTHENTICATED) {
    void router.push("/login");
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case Role.Admin:
      void router.push("/dashboard/admin");
      return <div>Redirecting...</div>;
    case Role.BranchRep:
      void router.push("/dashboard/branchrep");
      return <div>Redirecting...</div>;
    case Role.Judge:
      void router.push("/dashboard/judge");
      return <div>Redirecting...</div>;
    case Role.Jury:
      void router.push("/dashboard/jury");
      return <div>Redirecting...</div>;
    case Role.Organizer:
      void router.push("/dashboard/organizer");
      return <div>Redirecting...</div>;
    case Role.Participant:
      void router.push("/profile");
      return <div>Redirecting...</div>;
    default:
      void router.push("/login");
      return <div>Redirecting...</div>;
  }
};

export default Page;
