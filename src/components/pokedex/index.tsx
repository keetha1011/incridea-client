import { useMutation } from "@apollo/client";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

import Button from "~/components/button";
import Carousel from "~/components/slider";
import useStore from "~/components/store/store";
import { env } from "~/env";
import { AddXpDocument } from "~/generated/generated";

interface DexProps {
  data?: { id: string; name: string; image: string }[];
}

interface DexProps {
  data?: { id: string; name: string; image: string }[];
  isMuted: boolean;
  mainThemeAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const Pokedex: React.FC<DexProps> = ({
  data = [],
  isMuted,
  mainThemeAudioRef,
}) => {
  const setEventDex = useStore((state) => state.setEventDex);
  // useEffect(() => {
  //   setEventDex();
  // }, []);
  const eventDex = useStore((state) => state.eventDex);
  const [fullyOpen, setFullyOpen] = useState(false);
  const [calledXp, setCalledXp] = useState(false);
  let mutationCalled = false;

  const [addXp] = useMutation(AddXpDocument, {
    variables: {
      levelId: "4",
    },
    refetchQueries: ["GetUserXp"],
    awaitRefetchQueries: true,
  });

  const handleAddXp = () => {
    if (calledXp) {
      return;
    }
    setCalledXp(true);
    const promise = addXp().then((res) => {
      if (res.data?.addXP.__typename === "MutationAddXPSuccess") {
        toast.success(
          `Congratulations!!! You have found ${res.data?.addXP.data.level.point} Xp`,
          {
            position: "bottom-center",
            style: {
              backgroundColor: "#7628D0",
              color: "white",
            },
          },
        );
      }
    });
  };

  useEffect(() => {
    const audio = new Audio(
      `${env.NEXT_PUBLIC_BASE_AUDIO_URL}/audio/level2/pokemon.mp3`,
    );
    audio.volume = 0.3;
    const mainRef = mainThemeAudioRef;
    if (isMuted) {
      return;
    } else if (!isMuted && eventDex) {
      mainRef?.current?.pause();
      audio.play();
    }
    return () => {
      audio.pause();
      mainRef?.current?.play();
    };
  }, [eventDex, isMuted, mainThemeAudioRef]);

  useEffect(() => {
    // Initialize GSAP
    const tl = gsap.timeline();

    // Initial state (closed)
    tl.call(() => {
      setFullyOpen(false);
    })
      .set(".animate-1", { y: 100 })
      .set(".animate-3", { y: -80 })
      .set(".carousel-container", { opacity: 0 });

    // Opening animation
    tl.to(".animate-1", { y: -20, duration: 2, delay: 1 })
      .to(".animate-3", { y: 40, duration: 2 }, "<")
      .to(".carousel-container", { opacity: 1, duration: 3 }, "<")
      .call(() => {
        console.log("Fully open");
        setFullyOpen(true);
        if (!mutationCalled) {
          mutationCalled = true;
          handleAddXp();
        }
      });
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50">
      <div className="page-container relative h-screen">
        {/* Pokedex background */}

        <div className="animation-container relative top-[5%] z-0 flex h-full w-full flex-col items-center">
          {/* Top part of Pokedex */}
          <div className="flex justify-end">
            {fullyOpen ? (
              <div
                className="absolute z-50 w-fit cursor-pointer rounded-bl-full rounded-tr-lg bg-[#3d0a10] px-4 py-4"
                style={{ pointerEvents: eventDex ? "all" : "none" }}
                onClick={setEventDex}
              >
                <IoMdClose className="text-lg text-white" />
              </div>
            ) : null}

            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/svg/dextop.svg`}
              alt="dexmid"
              width={2491}
              height={1082}
              className="animate-1 relative top-5 z-[1] aspect-[2491/1082] md:w-80"
            />
          </div>

          {/* Carousel at the center */}
          <div className="relative z-0 flex w-full flex-col items-center justify-center overflow-x-clip lg:overflow-x-visible">
            {/* Carousel */}
            <div className="relative z-10 flex w-full flex-col justify-center bg-[#B5FFF7] p-[10px] md:w-80">
              {/* Your carousel content goes here */}
              <div className="carousel-container relative flex h-full w-full flex-col items-center rounded-xl bg-blue-500 py-2">
                <Carousel events={data} />
                {/* Dex button inside the carousel container */}
                <Link
                  href={"/events"}
                  className="butanim relative -bottom-1 z-20 mb-2 flex w-full justify-center px-2"
                  target="_blank"
                >
                  <Button className="h-full font-VikingHell">
                    View Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom part of Pokedex */}
          <div>
            <Image
              src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/svg/dexbot.svg`}
              alt="dexmid"
              width={2491}
              height={1082}
              className="animate-3 relative bottom-10 z-0 aspect-[2491/1022] md:w-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
