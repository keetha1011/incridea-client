import React from "react";

import { QRCodeScanner } from "~/components/general/dashboard/organizer/qRCodeScanner";
import Dashboard from "~/components/layout/dashboard";

function Pronite() {
  return (
    <Dashboard className="flex justify-center items-center flex-col gap-4">
      <h2 className="titleFont mb-8 text-3xl text-white md:text-4xl">
        Pronite Scanner
      </h2>
      <div className="max-w-sm">
        <QRCodeScanner intent="pronite" />
      </div>
    </Dashboard>
  );
}

export default Pronite;
