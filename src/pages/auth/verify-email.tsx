import { type NextPage } from "next";

import VerifyEmailComponent from "~/components/form/verifyEmail";

const VerifyEmail: NextPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <VerifyEmailComponent />
    </div>
  );
};

export default VerifyEmail;
