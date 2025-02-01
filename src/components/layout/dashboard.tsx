import React from "react";

function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bodyFont min-h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#003d1c] via-[#002e1c]] to-[#004e2c] pt-24 text-gray-100 sm:p-10 sm:pt-20">
      {children}
    </div>
  );
}

export default Dashboard;
