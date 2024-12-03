import { Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState, useEffect } from "react";
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
  useEffect(() => {
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  });

  return (
    <nav
      className={`fixed top-0 z-20 w-full border-b border-gray-200/30 bg-white bg-opacity-10 font-VikingHell italic tracking-widest backdrop-blur-lg backdrop-filter`}
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="order-2 flex items-center space-x-2 lg:order-1"
          >
            <Image
              className="w-24"
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo.png`}
              alt="Logo"
              width={100}
              height={80}
              priority
            />
          </Link>

          <div className="hidden space-x-5 text-gray-900 lg:order-2 lg:flex">
            {links.map((link) => (
              <Link
                className="group text-white transition-colors duration-300"
                key={link.url}
                href={link.url}
              >
                <CharacterAnimation
                  text={link.label}
                  textStyle="text-lg font-medium drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.7)]"
                />
                <span
                  className={`${
                    activePath?.label === link.label ? "max-w-full" : "max-w-0"
                  } block h-0.5 bg-white transition-all duration-500 group-hover:max-w-full`}
                ></span>
              </Link>
            ))}
          </div>
          {!(router.pathname === "/login") && (
            <AuthButtons className="hidden lg:order-3 lg:flex" />
          )}
          <div className="flex items-center space-x-4 lg:hidden">
            {isMenuOpen ? (
              <XIcon
                className="h-6 w-6 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                onClick={toggleMenu}
              />
            ) : (
              <MenuIcon
                className="h-6 w-6 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                onClick={toggleMenu}
              />
            )}
          </div>

          <div className="order-3 lg:hidden">{<MobileButtons />}</div>
        </div>

        <Transition
          show={isMenuOpen}
          enter="transition-all ease-in-out duration-500"
          enterFrom="opacity-0 translate-y-6"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="lg:hidden">
            {links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                onClick={closeMenu}
                className="block px-2 pb-3 text-sm text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]"
              >
                {link.label}
              </Link>
            ))}
            {!(router.pathname === "/login") && (
              <AuthButtons className="mb-2" />
            )}
          </div>
        </Transition>
      </div>
    </nav>
  );
};

const AuthButtons: FC<{
  className?: string;
}> = ({ className }) => {
  const { status, user } = useAuth();
  return (
    <div className={`flex space-x-2 px-2 lg:px-0 ${className}`}>
      {status === AuthStatus.AUTHENTICATED && (
        <AuthenticatedButtons user={user} />
      )}
      {status === AuthStatus.NOT_AUTHENTICATED && (
        <>
          <Link href={"/login"} as="/login">
            <Button intent={"primary"}>Login</Button>
          </Link>
          <Link href={"/login?whichForm=signUp"} as="/login">
            <Button intent={"ghost"}>Sign Up</Button>
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
