// ---------------------------------------------------------------------------
// Mobile navigation: hamburger trigger + portal-based drawer + dialogs.
// The trigger stays in the header DOM; drawer + dialogs render at body root.
// ---------------------------------------------------------------------------

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { MobileDrawer } from "./MobileDrawer";
import { LanguageDialog } from "../dialogs/LanguageDialog";
import { ThemeDialog } from "../dialogs/ThemeDialog";
import { useDashboardStore } from "@modules/dashboard/stores/dashboardStore";

interface MobileNavbarProps {
  translations: Record<string, unknown>;
}

export function MobileNavbar({ translations }: MobileNavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [modal, setModal] = useState<"language" | "theme" | null>(null);
  const [mounted, setMounted] = useState(false);

  const mobileImportsOpen = useDashboardStore((s) => s.mobileImportsOpen);
  const setMobileImportsOpen = useDashboardStore((s) => s.setMobileImportsOpen);

  const closeDrawer = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setClosing(false);
    }, 200);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  // Close nav drawer when imports drawer opens
  useEffect(() => {
    if (mobileImportsOpen && drawerOpen) {
      closeDrawer();
    }
  }, [mobileImportsOpen, drawerOpen, closeDrawer]);

  // Close imports drawer when nav drawer opens
  const handleOpen = useCallback(() => {
    if (mobileImportsOpen) {
      setMobileImportsOpen(false);
    }
    setClosing(false);
    setDrawerOpen(true);
  }, [mobileImportsOpen, setMobileImportsOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (path: string): string => {
    // Simple inline resolver so the trigger button always works.
    const keys = path.split(".");
    let cur: unknown = translations;
    for (const k of keys) {
      if (typeof cur !== "object" || cur === null || !(k in cur)) return path;
      cur = (cur as Record<string, unknown>)[k];
    }
    return typeof cur === "string" ? cur : path;
  };

  // -- trigger (in normal DOM) -------------------------------------------
  return (
    <>
      <button
        type="button"
        aria-label={
          drawerOpen ? t("mobile.closeMenu") : t("mobile.openMenu")
        }
        onClick={() => {
          if (drawerOpen) {
            closeDrawer();
          } else {
            handleOpen();
          }
        }}
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-[var(--nav-border,var(--border))] bg-(--nav-bg) text-foreground backdrop-blur-xl transition hover:border-white/15"
      >
        {drawerOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* -- drawer + dialogs (portaled to body) -------------------------- */}
      {mounted &&
        createPortal(
          <>
            <MobileDrawer
              open={drawerOpen}
              closing={closing}
              onClose={closeDrawer}
              onOpenLanguage={() => setModal("language")}
              onOpenTheme={() => setModal("theme")}
              translations={translations}
            />

            <LanguageDialog
              open={modal === "language"}
              onClose={closeModal}
              translations={translations}
            />

            <ThemeDialog
              open={modal === "theme"}
              onClose={closeModal}
              translations={translations}
            />
          </>,
          document.body,
        )}
    </>
  );
}
