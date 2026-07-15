// ---------------------------------------------------------------------------
// Navbar — root orchestration component.
// Desktop: Brand (left) · DesktopNavigation (right).
// Mobile:  three-zone grid: [imports toggle] [centered Brand] [menu].
//
// The imports drawer for mobile is portaled to document.body.
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Brand } from "./brand/Brand";
import { DesktopNavigation } from "./desktop/DesktopNavigation";
import { MobileNavbar } from "./mobile/MobileNavbar";
import { ImportsDrawer } from "./drawer/ImportsDrawer";
import { useAppLocale } from "../providers";
import { getNavigationTranslations } from "../i18n/translations";
import {
  STORAGE_IMPORT_ID,
  useDashboardStore,
} from "@modules/dashboard/stores/dashboardStore";
import { ROUTES } from "@core/routing";
import { resolveTranslation } from "@core/i18n";

interface NavbarProps {
  translations?: Record<string, unknown>;
}

export function Navbar({ translations: initialTranslations }: NavbarProps) {
  const { locale, mounted } = useAppLocale();
  const [portalMounted, setPortalMounted] = useState(false);
  const translations = mounted
    ? getNavigationTranslations(locale)
    : (initialTranslations ?? getNavigationTranslations("en"));

  const mobileImportsOpen = useDashboardStore((s) => s.mobileImportsOpen);
  const setMobileImportsOpen = useDashboardStore((s) => s.setMobileImportsOpen);
  const desktopSidebarOpen = useDashboardStore((s) => s.desktopSidebarOpen);
  const setDesktopSidebarOpen = useDashboardStore((s) => s.setDesktopSidebarOpen);
  const sidebarWidth = useDashboardStore((s) => s.sidebarWidth);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const nt = (path: string): string => resolveTranslation(path, translations);
  const isDashboard =
    typeof window !== "undefined" &&
    window.location.pathname === ROUTES.dashboard;

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  useEffect(() => {
    if (!isDashboard) {
      setMobileImportsOpen(false);
      return;
    }

    const hasSelectedImport = localStorage.getItem(STORAGE_IMPORT_ID) !== null;
    if (!hasSelectedImport && window.matchMedia("(max-width: 767px)").matches) {
      setMobileImportsOpen(true);
    }
  }, [isDashboard, setMobileImportsOpen]);

  const toggleImports = useCallback(() => {
    setMobileImportsOpen(!mobileImportsOpen);
  }, [mobileImportsOpen, setMobileImportsOpen]);

  return (
    <header
      className="sticky top-0 z-50 h-16 border-b backdrop-blur-2xl backdrop-saturate-150 transition-[margin] duration-[250ms] ease-out"
      style={{
        borderColor: "var(--nav-border, rgb(255 255 255 / 0.08))",
        background:
          "var(--nav-bg, linear-gradient(180deg, rgba(23,23,23,0.78) 0%, rgba(10,10,10,0.58) 100%))",
        boxShadow: "var(--nav-shadow, 0 16px 50px -22px rgba(0,0,0,0.95))",
        marginLeft: isDashboard && isDesktop && desktopSidebarOpen ? sidebarWidth : 0,
      }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
        {/* Desktop: toggle + brand */}
        <div className="hidden md:flex items-center gap-2">
          {isDashboard ? (
            <button
              type="button"
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
              aria-label={desktopSidebarOpen ? "Close imports sidebar" : "Open imports sidebar"}
              aria-expanded={desktopSidebarOpen}
              title={desktopSidebarOpen ? "Close imports sidebar" : "Open imports sidebar"}
            >
              {desktopSidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </button>
          ) : null}
          <Brand translations={translations} />
        </div>

        {/* Mobile: dashboard — three-zone with centered brand */}
        {isDashboard ? (
          <div className="grid md:hidden grid-cols-[48px_1fr_48px] items-center h-full w-full px-2">
            <div className="flex justify-start">
              <button
                type="button"
                onClick={toggleImports}
                className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                aria-label={
                  mobileImportsOpen
                    ? nt("sidebar.hideToggle") || "Hide imports panel"
                    : nt("sidebar.showToggle") || "Show imports panel"
                }
              >
                {mobileImportsOpen ? (
                  <PanelLeftClose className="h-5 w-5" />
                ) : (
                  <PanelLeftOpen className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex justify-center overflow-hidden">
              <Brand translations={translations} />
            </div>
            <div className="flex justify-end">
              <MobileNavbar translations={translations} />
            </div>
          </div>
        ) : (
          /* Mobile: landing — brand left, menu right */
          <div className="flex md:hidden items-center h-full w-full justify-between px-2">
            <Brand translations={translations} />
            <MobileNavbar translations={translations} />
          </div>
        )}

        {/* right: desktop nav */}
        <DesktopNavigation translations={translations} />
      </div>

      {/* decorative bottom highlight */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "var(--nav-highlight, linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.08) 50%, transparent 100%))",
        }}
        aria-hidden="true"
      />

      {/* mobile imports drawer (dashboard only, portaled to body) */}
      {isDashboard &&
        portalMounted &&
        createPortal(
          <div className="md:hidden">
            <ImportsDrawer translations={translations} />
          </div>,
          document.body,
        )}
    </header>
  );
}
