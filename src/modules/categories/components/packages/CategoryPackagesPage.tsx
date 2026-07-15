import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@shared/components/ui";
import type { CategoryPackage, CategoryRule, UserCategory } from "../../types/categories.types";
import { CategoryPackageSidebar } from "./CategoryPackageSidebar";
import { CategoryPackageWorkspace } from "./CategoryPackageWorkspace";

interface CategoryPackagesPageProps {
  packages: CategoryPackage[];
  categories: UserCategory[];
  rules: CategoryRule[];
  usage: Map<string, number>;
  activePackageId: string | null;
  createPackage: (name: string, description?: string) => { ok: true; packageId: string } | { ok: false; error: string };
  updatePackage: (packageId: string, name: string, description?: string) => { ok: true } | { ok: false; error: string };
  duplicatePackage: (packageId: string) => { ok: true; packageId: string } | { ok: false; error: string };
  deletePackage: (packageId: string) => { ok: true } | { ok: false; error: string };
  createCategory: (packageId: string, name: string, color: string, icon?: string) => { ok: true; categoryId: string } | { ok: false; error: string };
  updateCategory: (categoryId: string, updates: Partial<Pick<UserCategory, "name" | "color" | "icon" | "isArchived">>) => { ok: true } | { ok: false; error: string };
  deleteCategory: (categoryId: string) => { ok: true } | { ok: false; error: string };
  moveCategory: (packageId: string, categoryId: string, direction: "up" | "down") => void;
  reorderCategory: (packageId: string, categoryId: string, targetPosition: number) => void;
  updateRule: (ruleId: string, updates: Partial<Pick<CategoryRule, "isActive" | "priority">>) => void;
  deleteRule: (ruleId: string) => void;
  t: (path: string) => string;
}

export function CategoryPackagesPage(props: CategoryPackagesPageProps) {
  const [editingPackageId, setEditingPackageId] = useState<string | null>(props.activePackageId);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  useEffect(() => {
    if (editingPackageId && window.innerWidth < 768) {
      setMobileView("detail");
    }
  }, [editingPackageId]);

  const selectedPackage = editingPackageId
    ? props.packages.find((pkg) => pkg.id === editingPackageId) ?? null
    : null;

  const selectedCategories = selectedPackage
    ? props.categories
        .filter((category) => category.packageId === selectedPackage.id)
        .sort((a, b) => a.order - b.order)
    : [];

  const selectedRules = selectedPackage
    ? props.rules.filter((rule) => rule.packageId === selectedPackage.id)
    : [];

  const handleDeletePackage = useCallback(
    (packageId: string) => {
      if (window.confirm("Delete this package? Categories, rules, and assignments for this package will be removed. Imports will remain.")) {
        props.deletePackage(packageId);
        if (editingPackageId === packageId) {
          setEditingPackageId(null);
          setMobileView("list");
        }
      }
    },
    [editingPackageId, props.deletePackage],
  );

  const handleDuplicate = useCallback(
    (packageId: string) => {
      const result = props.duplicatePackage(packageId);
      if (result.ok) {
        setEditingPackageId(result.packageId);
        setMobileView("detail");
      }
    },
    [props.duplicatePackage],
  );

  const handleSelect = useCallback((packageId: string) => {
    setEditingPackageId(packageId);
    if (window.innerWidth < 768) setMobileView("detail");
  }, []);

  const handleBack = useCallback(() => setMobileView("list"), []);

  return (
    <div className="flex h-full flex-col overflow-hidden md:flex-row">
      {/* Sidebar - always visible on desktop, conditional on mobile */}
      <div
        className={`w-full shrink-0 overflow-hidden border-border/50 md:w-[300px] md:border-r ${
          mobileView === "detail" ? "hidden md:block" : ""
        }`}
      >
        <div className="h-full p-3 md:p-4">
          <CategoryPackageSidebar
            packages={props.packages}
            categories={props.categories}
            selectedPackageId={editingPackageId}
            usage={props.usage}
            onSelect={handleSelect}
            onCreate={props.createPackage}
            onCreated={(packageId) => {
              setEditingPackageId(packageId);
              if (window.innerWidth < 768) setMobileView("detail");
            }}
            onDuplicate={handleDuplicate}
            onDelete={handleDeletePackage}
            t={props.t}
          />
        </div>
      </div>

      {/* Main workspace */}
      <div
        className={`flex flex-1 flex-col overflow-hidden ${
          mobileView === "list" ? "hidden md:flex" : ""
        }`}
      >
        {/* Mobile back button */}
        <div className="flex items-center border-b border-border/50 px-3 py-2 md:hidden">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to packages
          </Button>
        </div>

        <div className="flex-1 overflow-hidden p-3 md:p-4">
          <CategoryPackageWorkspace
            selectedPackage={selectedPackage}
            categories={selectedCategories}
            rules={selectedRules}
            usageCount={selectedPackage ? props.usage.get(selectedPackage.id) ?? 0 : 0}
            onUpdatePackage={(name, description) =>
              selectedPackage
                ? props.updatePackage(selectedPackage.id, name, description)
                : { ok: false as const, error: "No package selected." }
            }
            onDuplicate={() => selectedPackage && handleDuplicate(selectedPackage.id)}
            onDelete={() => selectedPackage && handleDeletePackage(selectedPackage.id)}
            onCreateCategory={(name, color, icon) => {
              if (!selectedPackage) return { ok: false as const, error: "Select a package first." };
              return props.createCategory(selectedPackage.id, name, color, icon) as { ok: true } | { ok: false; error: string };
            }}
            onUpdateCategory={props.updateCategory}
            onMoveCategory={(categoryId, direction) =>
              selectedPackage && props.moveCategory(selectedPackage.id, categoryId, direction)
            }
            onReorderCategory={(categoryId, targetIndex) =>
              selectedPackage && props.reorderCategory(selectedPackage.id, categoryId, targetIndex)
            }
            onDeleteCategory={props.deleteCategory}
            onToggleRule={(ruleId, isActive) => props.updateRule(ruleId, { isActive })}
            onDeleteRule={props.deleteRule}
            t={props.t}
          />
        </div>
      </div>
    </div>
  );
}