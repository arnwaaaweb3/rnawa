"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { disableDraftMode } from "@/app/action";
import { useDraftModeEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const environment = useDraftModeEnvironment();
  
  // JANGAN muncul kalo lagi di dalem Studio (Presentation Tool)
  if (environment !== "live" && environment !== "unknown") {
  return null;
  }

  return (
    <button 
      style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }}
      onClick={() => startTransition(async () => {
        await disableDraftMode();
        router.refresh();
      })}
      disabled={pending}
    >
      {pending ? "Disabling..." : "Exit Preview Mode"}
    </button>
  );
}