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
  } | null;
  isPending: boolean;
}

const useSession = (): SessionData => {

  const { data: session, isPending, error } = authClient.useSession();

  return {
    user: session?.user ?? null,
    isPending: isPending,
  };
};

export default useSession;
