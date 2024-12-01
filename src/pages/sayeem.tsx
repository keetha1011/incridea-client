import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { UploadButton } from "~/components/uploadThingButton";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string>();
  const [name, setName] = useState<string>();
  const [type, setType] = useState<string>();
  const [fileHash, setFileHash] = useState<string>();

  useEffect(() => {
    const fetchToken = async () => {
      const session = await getSession();
      const authToken = session ? `Bearer ${session.accessToken}` : null;
      setToken(authToken);
    };

    void fetchToken();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex-col justify-center text-center">
        <p>url: {url}</p>
        <p>fileType: {type}</p>
        <p>og filename: {name}</p>
        <p>filehash: {fileHash}</p>
        <p>accessToken: {token}</p>

        {url?.length && <img className="m-auto mt-12" src={url} alt="" />}
      </div>

      <UploadButton
        endpoint="eventUploader"
        headers={{
          Authorization: token ?? "wewq",
        }}
        onBeforeUploadBegin={(files) => {
          // Preprocess files before uploading (e.g. rename them)
          return files.map(
            (f) => new File([f], "renamed-" + f.name, { type: f.type }),
          );
        }}
        onClientUploadComplete={(res) => {
          console.log("Files: ", res[0]?.url);
          setUrl(res[0]?.url);
          setName(res[0]?.name);
          setType(res[0]?.type);
          setFileHash(res[0]?.fileHash);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
