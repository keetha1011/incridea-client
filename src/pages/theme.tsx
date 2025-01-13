import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { env } from "~/env";

function Theme() {
  // redirect to youtube
  const router = useRouter();

  useEffect(() => {
    void router.push("https://youtu.be/GdmrDe-VIlo?feature=shared");
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <Image
        src={`${env.NEXT_PUBLIC_BASE_IMAGE_URL}/assets/png/logo.png`}
        className="animate-pulse"
        alt="logo"
        width={300}
        height={300}
      />
    </div>
  );
}

export default Theme;
