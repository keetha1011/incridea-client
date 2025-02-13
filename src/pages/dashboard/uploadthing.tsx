import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Dashboard from "~/components/layout/dashboard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { UploadButton } from "~/components/uploadthing/button";
import { Role } from "~/generated/generated";
import { AuthStatus, useAuth } from "~/hooks/useAuth";

const Page = () => {
  const router = useRouter();
  const { user, loading, status } = useAuth();

  if (loading)
    return (
      <Dashboard>
        <div>Loading...</div>
      </Dashboard>
    );

  if (
    status === AuthStatus.NOT_AUTHENTICATED ||
    !user ||
    user.role !== Role.Admin
  ) {
    void router.push("/profile");
    return (
      <Dashboard>
        {" "}
        <div>Redirecting...</div>
      </Dashboard>
    );
  }

  return <InnerPage />;
};

const InnerPage = () => {
  const [value, setValue] = useState("");
  const [customIdSet, setCustomIdSet] = useState(false);
  const [customId, setCustomId] = useState("");

  return (
    <Dashboard>
      <div className="flex justify-center items-center size-full h-[80vh]">
        <div className="flex flex-col size-96 gap-4">
          <div className="flex gap-4">
            <Input
              value={value}
              onChange={(e) => {
                setCustomIdSet(false);
                setValue(e.target.value);
              }}
              placeholder="/dir/sub dir/file.ext"
            />
            <Button
              onClick={() => {
                const result = new RegExp(
                  /^([\\\/][a-zA-Z0-9\s]+)+.[a-zA-Z0-9]+$/g,
                ).test(value);
                if (!result) {
                  toast.error("Invalid path, example: /dir/subdir/file.ext");
                  return;
                }
                setCustomIdSet((prev) => !prev);
                setCustomId(value);
              }}
            >
              Set as File Path
            </Button>
          </div>
          <UploadButton
            disabled={!customIdSet}
            endpoint="asset"
            customId={customId}
          />
        </div>
      </div>
    </Dashboard>
  );
};

export default Page;
