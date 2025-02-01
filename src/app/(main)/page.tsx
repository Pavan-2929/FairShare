import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ShowTransactions from "./(Transaction)/ShowTransactions";
import Home from "./(Transaction)/Home";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) redirect("/sign-in");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 p-5 pt-7 pe-16 space-y-10">
          <Home />
        </div>
      </div>
    </div>
  );
}
