"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

let deferredPrompt: any = null;

export default function InstallButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // If already installed before, never show again
    if (localStorage.getItem("pwa-installed") === "true") return;

    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If app gets installed, hide forever
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("pwa-installed", "true");
      setVisible(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === "accepted") {
          localStorage.setItem("pwa-installed", "true");
          setVisible(false);
        }

        deferredPrompt = null;
      }}
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        rounded-full px-5 py-3
        bg-slate-900 text-white
        shadow-lg shadow-black/20
        hover:bg-slate-800
        active:scale-95
        transition-all duration-200
      "
    >
      <Download size={18} />
      <span className="font-medium text-sm">Install App</span>
    </button>
  );
}
