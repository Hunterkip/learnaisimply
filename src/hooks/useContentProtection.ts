import { useEffect } from "react";

/**
 * Hook to disable right-click context menu and common keyboard shortcuts
 * for content protection on course pages
 */
export function useContentProtection() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click on inputs and textareas
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common save/copy shortcuts on media
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "s" || e.key === "S")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
