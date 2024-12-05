import { signOut } from "next-auth/react";
import Link from "next/link";
import { type FC } from "react";
import { FaSignOutAlt } from "react-icons/fa";

import Button from "~/components/button";
import { Role, type User } from "~/generated/generated";

const AuthenticatedButtons: FC<{
  user: User | undefined | null;
}> = ({ user }) => {
  return (
    <>
      {user?.role === Role.User ? (
        <div className="flex space-x-2">
          <Link href="/register">
            <Button>Register </Button>
          </Link>
          <Button onClick={() => signOut()} className="w-fit" intent={"ghost"}>
            <FaSignOutAlt className="mr-1 inline-block" />
            Sign Out
          </Button>
        </div>
      ) : (
        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
      )}

      {user?.role !== Role.User && user?.role !== Role.Participant && (
        <Link href={`/dashboard/${user?.role.replace("_", "").toLowerCase()}`}>
          <Button intent="ghost">Dashboard</Button>
        </Link>
      )}
    </>
  );
};

export default AuthenticatedButtons;
