import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
import {
  RegisterProniteDocument,
  UserByIdDocument,
} from "~/generated/generated";
import { pidToId } from "~/utils/id";

function Pronite({
  pId,
  stopCamera,
  startCamera,
  clearScanResults,
}: {
  pId: string;
  stopCamera: () => void;
  startCamera: () => void;
  clearScanResults: () => void;
}) {
  const [cameraOn, setCameraOn] = useState(true);
  const [registerPronite, { data, loading }] = useMutation(
    RegisterProniteDocument,
    {
      variables: {
        userId: pidToId(pId),
      },
    },
  );

  const { data: userData, loading: userLoading } = useQuery(UserByIdDocument, {
    variables: {
      id: pidToId(pId),
    },
  });

  useEffect(() => {
    if (
      data?.registerPronite.__typename === "MutationRegisterProniteSuccess" ||
      data?.registerPronite.__typename === "Error"
    ) {
      stopCamera();
      setCameraOn(false);
    }
  }, [data, stopCamera]);

  return (
    <>
      <div className="mb-3 mt-1 max-w-sm">
        {!cameraOn ? (
          <Button
            onClick={() => {
              startCamera();
              clearScanResults();
              setCameraOn(true);
            }}
            intent={"success"}
            className="mx-auto rounded bg-blue-500 px-7 py-2.5 font-bold text-white hover:bg-blue-700"
          >
            Scan Again
          </Button>
        ) : (
          <Button
            intent={"success"}
            className="mx-auto rounded bg-blue-500 px-7 py-2.5 font-bold text-white hover:bg-blue-700"
            onClick={async () => await registerPronite()}
          >
            Register
          </Button>
        )}
      </div>
      {loading ? (
        <>
          <Spinner className="mt-3" intent={"white"} size={"small"} />
        </>
      ) : data?.registerPronite.__typename ===
        "MutationRegisterProniteSuccess" ? (
        <div className="bodyFont rounded-md bg-white/10 p-3">
          <div className="mb-1 text-lg leading-snug text-green-500">
            <span className="font-bold">{pId}</span> registered for Pronite
          </div>
          <div className="text-white">
            <div className="text-lg leading-snug">
              {data.registerPronite.data.user.name}
            </div>
            <div className="text-sm leading-snug">
              {data.registerPronite.data.user.college?.name}
            </div>
            <div className="text-sm leading-snug">
              {data.registerPronite.data.user.phoneNumber}
            </div>
          </div>
        </div>
      ) : (
        <div className="bodyFont rounded-md bg-white/10 font-semibold text-red-500">
          {userLoading && <Spinner intent={"white"} size={"small"} />}
          {data?.registerPronite.message && (
            <div>
              <p className="p-3 py-2">{data.registerPronite.message}</p>
              {userData?.userById.__typename === "QueryUserByIdSuccess" &&
                !data.registerPronite.message.includes("authorized") && (
                  <div className="bodyFont rounded-md bg-white/10 p-3">
                    <div className="mb-1 text-lg leading-snug">
                      <span className="font-bold text-green-500">{pId}</span>
                    </div>
                    <div className="text-white">
                      <div className="text-lg leading-snug">
                        {userData.userById.data.name}
                      </div>
                      <div className="text-sm leading-snug">
                        {userData.userById.data.college?.name}
                      </div>
                      <div className="text-sm leading-snug">
                        {userData.userById.data.phoneNumber}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Pronite;
