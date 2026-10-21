"use client";

import { Plus } from "@phosphor-icons/react";

/** The round plus that turns into a cross while its panel is open. */
export function ToggleMark({ open }: { open: boolean }) {
  return (
    <Plus
      size={15}
      weight="bold"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-500 ease-out-expo ${
        open ? "rotate-45" : ""
      }`}
    />
  );
}

interface CollapseProps {
  id: string;
  open: boolean;
  children: React.ReactNode;
}

/* ---------------------------------------------------------------------------
   Height-animated disclosure.

   A grid row going from 0fr to 1fr animates to the content's real height with
   no measuring and no JavaScript on the frame. While closed the content is
   inert, so nothing inside it can take focus or be read out.
--------------------------------------------------------------------------- */
export function Collapse({ id, open, children }: CollapseProps) {
  return (
    <div
      id={id}
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out-expo ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
