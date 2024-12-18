import { useMutation } from "@apollo/client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import Spinner from "~/components/spinner";
// import { CreateSubmissionDocument } from "~/generated/generated";
import { UploadButton } from "~/components/uploadthing/button";
import toast from "react-hot-toast";
import { CreateSubmissionDocument } from "~/generated/generated";
import { set } from "zod";

type Props = {
  existingImage?: string | null;
  // setImage: (arg1: File | null) => void;
  loading: boolean;
  handleImageUpload: (url: string) => void;
  cardId: string;
};

// GONNA TAKE OFF THE MUTATION HERE
// Better if we pass the url to parent and save it local
// then send it to the server when the user is done with the form

const QuizImageUpload = ({
  existingImage,
  loading,
  handleImageUpload,
  cardId,
}: Props) => {
  const [highlighted, setHighlighted] = useState(false);

  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [manualLoading, setManualLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [submissionMutation, { loading: submissionLoading }] = useMutation(
    CreateSubmissionDocument,
  );

  return (
    <>
      <div
        className={`bodyFont flex grow items-center justify-center rounded-b-md md:rounded-md ${
          highlighted ? "bg-blue/20 ring-2 ring-blue-500" : "bg-black/20"
        }`}
        // onClick={() => {
        //   inputRef.current?.click();
        // }}
        // onDragOver={(e) => {
        //   e.preventDefault();
        //   setHighlighted(true);
        // }}
        // onDragLeave={(e) => {
        //   e.preventDefault();
        //   setHighlighted(false);
        // }}
        // onDrop={(e) => {
        //   e.preventDefault();
        //   setHighlighted(false);

        //   const droppedFile = Array.from(e.dataTransfer.files);

        //   if (droppedFile[0]) {
        //     // setImage(droppedFile[0]);
        //     setMediaPreview(URL.createObjectURL(droppedFile[0]));
        //   }
        // }}
      >
        {loading || submissionLoading || manualLoading ? (
          <>
            <Spinner />
          </>
        ) : existingImage && !mediaPreview ? (
          <div className="rounded-sm">
            <Image
              className="h-64 object-contain"
              src={existingImage}
              width={600}
              height={600}
              alt=""
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
              alt=""
            />
          </div>
        )}
      </div>
      <UploadButton
        endpoint="quizQuestionImgUploader"
        className="mt-6"
        onBeforeUploadBegin={(files) => {
          //   setImage(files[0]!);
          setMediaPreview(URL.createObjectURL(files[0]!));
          console.log(files[0]);
          return files.map((f) => new File([f], f.name, { type: f.type }));
        }}
        onUploadBegin={() => {
          setManualLoading(true);
        }}
        onClientUploadComplete={async (res) => {
          if (res[0]) {
            console.log("----");
            console.log(res[0].url);
            setMediaPreview(res[0].url);
            await submissionMutation({
              variables: {
                cardId: Number(cardId),
                image: res[0].url,
              },
            })
              .then((res) => {
                if (
                  res.data?.createSubmission.__typename !==
                  "MutationCreateSubmissionSuccess"
                )
                  throw new Error("Error uploading submission");
                toast.success("Image uploaded", { position: "bottom-right" });
              })
              .catch((err) => {
                alert(err);
              });
            setManualLoading(false);
            handleImageUpload(res[0].url);
          }
        }}
        onUploadAborted={() => {
          toast.error("Image upload aborted", { position: "bottom-right" });
          setManualLoading(false);
        }}
        onUploadError={(error) => {
          console.log(error);
          toast.error("Image upload failed", { position: "bottom-right" });
          setManualLoading(false);
        }}
      />
    </>
  );
};

export default QuizImageUpload;
