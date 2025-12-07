import Navbar from "@/components/shared/Navbar";
import React from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full'>
      <div>
        <Navbar />
      </div>
      {children}
    </div>
  );
};

export default CommonLayout;
