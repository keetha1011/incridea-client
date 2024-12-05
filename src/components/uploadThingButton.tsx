import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { getSession } from "next-auth/react";
import { ComponentProps } from "react";

import { env } from "~/env";

export const UploadButtonDefault = generateUploadButton({
  url: env.NEXT_PUBLIC_SERVER_URL + "/uploadthing",
});

export function UploadButton(
  props: ComponentProps<typeof UploadButtonDefault>,
) {
  return (
    <UploadButtonDefault
      {...props}
      headers={async () => ({
        Authorization: (await getSession())?.accessToken ?? "",
      })}
    />
  );
}
export const UploadDropZone = generateUploadDropzone({
  url: env.NEXT_PUBLIC_SERVER_URL + "/uploadthing",
});
