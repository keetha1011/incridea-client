import Image from "next/image";

import { env } from "~/env";

export default function Loader({ loading }: { loading: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
      style={{
        opacity: loading ? 1 : 0,
        transition: "opacity 1.5s",
        pointerEvents: loading ? "auto" : "none",
      }}
    >
      <Image
        src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/loader/dodLogo.png`}
        alt=""
        height={180}
        width={180}
        className="animate-pulse opacity-80"
      />
    </div>
  );
}
