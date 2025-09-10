import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(!session) {
    redirect("/sign-in"); 
  }

  // Redirect authenticated users to dashboard
  redirect("/dashboard");
}
 
export default Page;