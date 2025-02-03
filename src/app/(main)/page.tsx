import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Home from "./(Transaction)/Home";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) redirect("/sign-in");

  return (
    <div className="flex-1 space-y-10">
      <Home />
    </div>
  );
}
