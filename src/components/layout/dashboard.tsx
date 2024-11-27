import React from "react";

function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bodyFont min-h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-b from-primary-800 to-primary-700 pt-24 text-gray-100 sm:p-10 sm:pt-20">
      {children}
    </div>
  );
}

export default Dashboard;
