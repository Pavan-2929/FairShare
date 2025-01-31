import { authClient } from "@/lib/auth-client";

const useSession = () => {
  const { data: session, isPending, error } = authClient.useSession();
  const user = session?.user;

  if (!user) return null;

  return user as NonNullable<typeof user>;
};

export default useSession;
