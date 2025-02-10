import { generateUploadButton } from "@uploadthing/react";
import { getSession } from "next-auth/react";
import { type ComponentProps } from "react";

import { env } from "~/env";

const UploadButton = (
  props: ComponentProps<ReturnType<typeof generateUploadButton>>,
) => {
  const Comp = generateUploadButton({
    url: `${env.NEXT_PUBLIC_SERVER_HTTP_URL}/uploadthing`,
  });

  return (
    <Comp
      {...props}
      headers={async () => ({
        Authorization: (await getSession())?.accessToken ?? "",
      })}
    />
  );
};

export { UploadButton };
