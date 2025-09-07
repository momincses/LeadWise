"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Logged in as {session.user.name}</p>
      <Button
        onClick={async () => {
          authClient.signOut();
          await authClient.signOut();
          router.push("/sign-in");
        }}
      >
        Sign out
      </Button>
    </div>
  );
};
