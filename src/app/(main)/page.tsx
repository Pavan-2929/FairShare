import Image from "next/image";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import PersonalBudget from "./(Transaction)/PersonalBudget";
import ShowTransactions from "./(Transaction)/ShowTransactions";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) redirect("/sign-in");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 p-5 pe-16 space-y-10">
          <PersonalBudget />
          <ShowTransactions />
        </div>
      </div>
    </div>
  );
}
