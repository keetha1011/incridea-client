import React from "react";

import { QRCodeScanner } from "~/components/general/dashboard/organizer/QRCodeScanner";

function Pronite() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-[#400067] to-[#16042b] p-5 pt-20">
      <h2 className="titleFont mb-8 text-3xl text-white md:text-4xl">
        Pronite Scanner
      </h2>
      <div className="max-w-sm">
        <QRCodeScanner intent="pronite" />
      </div>
    </div>
  );
}

export default Pronite;
