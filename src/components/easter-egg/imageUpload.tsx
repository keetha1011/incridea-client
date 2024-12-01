import { useMutation } from "@apollo/client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import Spinner from "~/components/spinner";
import { env } from "~/env";
import { CreateSubmissionDocument } from "~/generated/generated";
import { UploadButton, UploadDropZone } from "../uploadThingButton";
import { getSession } from "next-auth/react";

type Props = {
  existingImage?: string | null;
  setImage: (arg1: File | null) => void;
  loading: boolean;
  cardId: string;
};

const ImageUpload = ({ existingImage, setImage, loading, cardId }: Props) => {
  const [highlighted, setHighlighted] = useState(false);

  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [manualLoading, setManualLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState<string | null>(null);

  const [submissionMutation, { data, loading: submissionLoading, error }] =
    useMutation(CreateSubmissionDocument);

  useEffect(() => {
    const fetchToken = async () => {
      const session = await getSession();
      const authToken = session ? `Bearer ${session.accessToken}` : null;
      setToken(authToken);
    };

    void fetchToken();
  }, []);

  return (
    <>
      <div
        className={`bodyFont flex min-h-[150px] grow cursor-pointer items-center justify-center rounded-b-md md:rounded-md ${
          highlighted ? "bg-blue/20 ring-2 ring-blue-500" : "bg-black/20"
        }`}
        onClick={() => {
          inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setHighlighted(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setHighlighted(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setHighlighted(false);

          const droppedFile = Array.from(e.dataTransfer.files);

          if (droppedFile[0]) {
            setImage(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }
        }}
      >
        {loading || submissionLoading || manualLoading ? (
          <>
            <Spinner />
          </>
        ) : existingImage && !mediaPreview ? (
          <div className="rounded-sm">
            <Image
              width={1500}
              height={1500}
              className="h-64 object-contain"
              src={existingImage}
              alt="Clue Image"
            />
          </div>
        ) : mediaPreview === null ? (
          <>
            <span className="p-5">Upload image</span>
          </>
        ) : (
          <div className="rounded-sm">
            <Image
              width={1500}
              height={1500}
              className="h-64 object-contain"
              src={mediaPreview}
              alt="Clue Image"
            />
          </div>
        )}
      </div>
      <UploadButton
        endpoint="easterEggUploader"
        headers={{
          Authorization: token ?? "",
        }}
        onBeforeUploadBegin={(files) => {
          setImage(files[0]!);
          setMediaPreview(URL.createObjectURL(files[0]!));

          return files.map((f) => new File([f], f.name, { type: f.type }));
        }}
        onUploadBegin={() => {
          setManualLoading(true);
        }}
        onClientUploadComplete={async (res) => {
          setMediaPreview(res[0]?.url!);
          await submissionMutation({
            variables: {
              cardId: Number(cardId),
              image: res[0]?.url!,
            },
          })
            .then((res) => {
              if (
                res.data?.createSubmission.__typename !==
                "MutationCreateSubmissionSuccess"
              ) {
                throw new Error("Error uploading submission");
              }
            })
            .catch((err) => {
              alert(err);
            });
          setManualLoading(false);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  );
};

export default ImageUpload;
