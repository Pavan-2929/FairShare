import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { getUser } from "@/utils/getUser";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-col w-full">
            <Navbar />
            <div className="flex-1 p-7 pe-16 space-y-10">{children}</div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
