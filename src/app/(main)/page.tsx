import Image from "next/image";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(), 
  });

    if(!session || !session.user) redirect("/sign-in")

  return (
    <div>
      Hii from main
      <p>{session.user.email}</p>
    </div>
  );
}
