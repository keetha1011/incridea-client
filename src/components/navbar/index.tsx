import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC } from "react";

import CharacterAnimation from "~/components/animation/character";
import Button from "~/components/button";
import { env } from "~/env";
import { AuthStatus, useAuth } from "~/hooks/useAuth";

import AuthenticatedButtons from "./authenticatedButtons";
import { Role } from "~/generated/generated";

const Navbar = () => {
  const links = [
    { label: "Home", url: "/" },
    { label: "Events", url: "/events" },
    { label: "Pronites", url: "/pronites" },
    { label: "Gallery", url: "/gallery" },
    { label: "Explore", url: "/explore" },
    { label: "About", url: "/about" },
  ];

  const router = useRouter();

  return (
    <>
      <nav className="fixed top-0 w-full flex justify-center z-50">
        <div className="relative flex w-[55rem] justify-center">
          <div className="absolute bg-red-500 skew-x-[60deg] h-[4rem] w-full top-0 -translate-x-32 z-30"></div>
          <div className="absolute bg-red-500 skew-x-[-60deg] h-[4rem] w-full top-0 z-40 translate-x-32"></div>
          <div className="w-full flex justify-between z-50 pt-2">
            <Link href="/">
              <Image
                className="w-24 transition-opacity hover:opacity-75"
                src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo.png`}
                alt="Logo"
                width={100}
                height={80}
                priority
              />
            </Link>
            {/* <div className="flex space-x-8">
              {links.map((link) => (
                <Link key={link.url} href={link.url}>
                  <span className="text-lg font-semibold text-gray-300 hover:text-white">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div> */}
            <div>
              <AuthButtons />
            </div>
          </div>
        </div>
      </nav>
      {/* space top */}
      <div className="h-16"></div>
    </>
  );
};

const AuthButtons: FC<{ className?: string }> = ({ className }) => {
  const { status, user } = useAuth();
  return (
    <div className={`flex space-x-3 ${className}`}>
      {status === AuthStatus.AUTHENTICATED && (
        <AuthenticatedButtons user={user} />
      )}
      {status === AuthStatus.NOT_AUTHENTICATED && (
        <>
          <Link href={"/login"} as="/login">
            <Button intent={"primary"} className="bg-red-500 hover:bg-red-600">
              Login
            </Button>
          </Link>
          <Link href={"/login?whichForm=signUp"} as="/login">
            <Button
              intent={"ghost"}
              className="border-red-500 text-red-500 hover:bg-red-500/10"
            >
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

// Removed MobileButtons component

export default Navbar;
