import { generateUploadDropzone } from "@uploadthing/react";
import { getSession } from "next-auth/react";
import { memo, type ComponentProps } from "react";

import { env } from "~/env";

const UploadDropzone = memo((
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
})

UploadDropzone.displayName = "UploadDropzone";

export { UploadDropzone };
