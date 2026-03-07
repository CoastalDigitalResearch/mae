import { redirect } from "next/navigation";
import { isConfigured } from "@/lib/config";
import { Desktop } from "@/components/desktop";

export default function Home() {
  if (!isConfigured()) {
    redirect("/init");
  }

  return <Desktop />;
}
