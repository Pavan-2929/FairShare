import { authClient } from "@/lib/auth-client";

interface SessionData {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    phoneNumber?: string | null;
    age?: number | null;
    gender?: "male" | "female" | "other" | null;
    city?: string | null;
  } | null;
  isPending: boolean;
}

const useSession = (): SessionData => {
  const { data: session, isPending } = authClient.useSession();
  return {
    user: session?.user ?? null,
    isPending: isPending,
  };
};

export default useSession;
