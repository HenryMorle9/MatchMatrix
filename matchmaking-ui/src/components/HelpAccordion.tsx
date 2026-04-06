import type { ReactNode } from "react";

export default function HelpAccordion({ children }: { children: ReactNode }) {
  return (
    <details className="theme-panel-subtle rounded px-5 py-4">
      <summary className="theme-label cursor-pointer select-none text-sm font-semibold">
        How does this work?
      </summary>
      <div className="mt-4 space-y-3 text-sm leading-relaxed">
        {children}
      </div>
    </details>
  );
}
