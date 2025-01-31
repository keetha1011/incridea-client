import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC, useState, useEffect } from "react";
import { AiOutlineClose as XIcon } from "react-icons/ai";
import { BiMenuAltLeft as MenuIcon } from "react-icons/bi";

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const activePath = links.find((link) => link.url === router.pathname);

  const closeMenu = () => {
    if (isMenuOpen) setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Trapezoid Menu Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu();
        }}
        className="fixed left-1/2 top-0 z-50 -translate-x-1/2 transform"
      >
        <div className="relative h-14 w-48 overflow-hidden">
          <div className="absolute h-full w-full bg-gradient-to-b from-red-600 to-red-700 transition-colors hover:from-red-500 hover:to-red-600">
            <div className="absolute bottom-0 h-full w-full skew-x-[20deg] transform bg-gradient-to-r from-black/20 to-transparent" />
            <div className="absolute bottom-0 h-full w-full -skew-x-[20deg] transform bg-gradient-to-l from-black/20 to-transparent" />
          </div>
          <div className="relative flex h-full items-center justify-center">
            <span className="font-bold uppercase tracking-widest text-white">
              {isMenuOpen ? "Close" : "Menu"}
            </span>
          </div>
        </div>
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/95 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center pt-16">
          <div className="grid gap-8">
            {links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                onClick={closeMenu}
                className="group relative"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-0.5 w-4 bg-red-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="text-2xl font-bold uppercase tracking-wider text-gray-400 transition-colors group-hover:text-white">
                    {link.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {!(router.pathname === "/login") && (
            <div className="mt-12">
              <AuthButtons />
            </div>
          )}
        </div>
      </div>

      {/* Regular navbar content */}
      <nav className="fixed top-0 z-30 w-full">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                className="w-24 transition-opacity hover:opacity-75"
                src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo.png`}
                alt="Logo"
                width={100}
                height={80}
                priority
              />
            </Link>
            <div className="flex items-center space-x-4">
              <MobileButtons />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

const AuthButtons: FC<{
  className?: string;
}> = ({ className }) => {
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

const MobileButtons: FC<{
  className?: string;
}> = ({ className }) => {
  const { status, user } = useAuth();
  const router = useRouter();
  return (
    <div className={`flex space-x-2 lg:px-0 ${className}`}>
      {status === AuthStatus.AUTHENTICATED &&
        (router.pathname === "/profile" &&
        user?.role !== Role.User &&
        user?.role !== Role.Participant ? (
          <Link
            href={`/dashboard/${user?.role.replace("_", "").toLowerCase()}`}
          >
            <Button intent="ghost">Dashboard</Button>
          </Link>
        ) : (
          <Link href="/profile">
            <Button>Profile</Button>
          </Link>
        ))}
      {status === AuthStatus.NOT_AUTHENTICATED && (
        <>
          <Link href={"/login"} as="/login">
            <Button intent={"primary"}>Login</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
