import Image from "next/image";
import React, { useState } from "react";

import Spinner from "~/components/spinner";
// import { CreateSubmissionDocument } from "~/generated/generated";
import { UploadButton } from "~/components/uploadthing/button";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";

import { env } from "~/env";

type Props = {
  existingImage?: string | null;
  // setImage: (arg1: File | null) => void;
  loading: boolean;
  handleImageUpload: (url: string) => void;
};

// GONNA TAKE OFF THE MUTATION HERE
// Better if we pass the url to parent and save it local
// then send it to the server when the user is done with the form

const QuizImageUpload = React.memo(
  ({ existingImage, loading, handleImageUpload }: Props) => {
    // const [highlighted, setHighlighted] = useState(false);
    const highlighted = false;

    const [mediaPreview, setMediaPreview] = useState<string>("");
    const [manualLoading, setManualLoading] = useState(false);
    // const inputRef = useRef<HTMLInputElement>(null);

    // const [submissionMutation, { loading: submissionLoading }] = useMutation(
    //   CreateSubmissionDocument,
    // );

    const deleteImage = async (url: string) => {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/uploadrthing/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: (await getSession())?.accessToken ?? "",
          },
          body: JSON.stringify({ url }),
        },
      );
    };

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
          {loading || manualLoading ? (
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
                priority
              />
            </div>
          ) : mediaPreview === null ? (
            <>
              <span className="p-5">Upload image</span>
            </>
          ) : (
            <div className="rounded-sm">
              <Image
                width={600}
                height={600}
                className="h-64 object-contain"
                src={mediaPreview}
                alt=""
                priority
              />
            </div>
          )}
        </div>
        <UploadButton
          endpoint="quizQuestionImgUploader"
          className="mt-6"
          onBeforeUploadBegin={(files) => {
            //   setImage(files[0]!);
            // setMediaPreview(URL.createObjectURL(files[0]!));
            console.log(files[0]);
            return files.map((f) => new File([f], f.name, { type: f.type }));
          }}
          onUploadBegin={() => {
            setManualLoading(true);
          }}
          onClientUploadComplete={(res) => {
            if (res[0]) {
              console.log(res[0].url);
              console.log("----");
              if (mediaPreview !== "") {
                const deleted = mediaPreview;
                deleteImage(deleted)
                  .then(() => {
                    console.log("Deleted");
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
              console.log("----");
              setMediaPreview(res[0].url);
              console.log(mediaPreview);
              setManualLoading(false);
              toast.success("Image uploaded", { position: "bottom-right" });
              handleImageUpload(res[0].url);
            }
          }}
          onUploadAborted={() => {
            toast.error("Image upload aborted, please upload other image", {
              position: "bottom-right",
            });
            setManualLoading(false);
          }}
          onUploadError={(error) => {
            console.log(error);
            toast.error("Image upload failed, please upload other image", {
              position: "bottom-right",
            });
            setManualLoading(false);
          }}
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.loading !== nextProps.loading ||
      prevProps.handleImageUpload !== nextProps.handleImageUpload
    );
  },
);

QuizImageUpload.displayName = "QuizImageUpload";

export default QuizImageUpload;
