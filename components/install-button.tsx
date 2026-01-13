'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Never show again if already installed
    if (localStorage.getItem('pwa-installed') === 'true') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      localStorage.setItem('pwa-installed', 'true');
      setVisible(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
      setVisible(false);
    }

    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div
      className="
        fixed bottom-6 left-4 right-4 z-50
        mx-auto max-w-md
        animate-slide-up
        rounded-2xl
        bg-gradient-to-br from-slate-900 to-slate-800
        p-4 text-white
        shadow-2xl shadow-black/30
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">
            Install Field Service Reports
          </p>
          <p className="text-xs text-white/80">
            Works offline • Faster access • App-like experience
          </p>
        </div>

        <button
          onClick={installApp}
          className="
            shrink-0
            rounded-xl
            bg-white px-4 py-2
            text-sm font-semibold
            text-slate-900
            hover:bg-slate-100
            active:scale-95
            transition-all
          "
        >
          Install
        </button>
      </div>
    </div>
  );
}
