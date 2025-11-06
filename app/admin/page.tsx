import { getIsAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import AdminAppWrapper from "./AdminAppWrapper";

const AdminPage = async () => {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) {
    redirect("/learn?reason=not_admin");
  }

  return <AdminAppWrapper />;
};

export default AdminPage;