import { generateUploadDropzone } from "@uploadthing/react";
import { getSession } from "next-auth/react";
import { type ComponentProps } from "react";

import { env } from "~/env";

const UploadDropzone = (
  props: ComponentProps<ReturnType<typeof generateUploadDropzone>> & {
    customId?: string;
  },
) => {
  const Comp = generateUploadDropzone({
    url: `${env.NEXT_PUBLIC_SERVER_HTTP_URL}/uploadthing`,
  });

  return (
    <Comp
      {...props}
      headers={async () => ({
        Authorization: (await getSession())?.accessToken ?? "",
        ...(props.customId ? { custom_id: props.customId } : {}),
      })}
    />
  );
};

export { UploadDropzone };
