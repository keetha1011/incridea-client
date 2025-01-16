import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Reveal from "~/components/Reveal";

import { env } from "~/env";

function Theme() {
  return <Reveal />;
}

export default Theme;
