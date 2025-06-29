"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { ssr: false });

const AdminAppWrapper = () => {
  return <App />;
};

export default AdminAppWrapper;
