import {
  generateUploadButton,
  generateUploadDropzone,
  generateUploader,
} from "@uploadthing/react";

import { env } from "~/env";

export const UploadButton = generateUploadButton({
  url: env.NEXT_PUBLIC_SERVER_URL + "/uploadthing",
});

export const UploadDropZone = generateUploadButton({
  url: env.NEXT_PUBLIC_SERVER_URL + "/uploadthing",
});
