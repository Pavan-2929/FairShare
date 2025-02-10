import Menubar from "@/components/mobile/Menubar";
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
          <div className="flex w-full flex-col">
            <Navbar />
            <Menubar />
            <div className="mb-16 flex-1 space-y-10 p-5 md:p-7 md:pe-7 lg:pe-16">
              {children}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
