import { generateUploadButton } from "@uploadthing/react";
import { getSession } from "next-auth/react";
import { memo, type ComponentProps } from "react";

import { env } from "~/env";

const UploadButton = memo(
  (
    props: ComponentProps<ReturnType<typeof generateUploadButton>> & {
      customId?: string;
    },
  ) => {
    const Comp = generateUploadButton({
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
  },
);

UploadButton.displayName = "UploadButton";

export { UploadButton };
