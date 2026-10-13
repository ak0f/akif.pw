"use client";

import { Plus } from "@phosphor-icons/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Project } from "@/data/projects";
import TechList from "./TechList";

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

/* ---------------------------------------------------------------------------
   The opened state of a project: the longer description on one side, and the
   facts as a ruled list on the other. Shared by the featured stages and the
   compact rows, so a project reads the same wherever it sits.
--------------------------------------------------------------------------- */
export default function ProjectDetails({
  project,
  showStack = false,
}: {
  project: Project;
  /** The stages already show the stack in their header. */
  showStack?: boolean;
}) {
  const { locale, t } = useLanguage();
  const copy = project.copy[locale];

  const facts: { label: string; value: string }[] = [
    { label: t.projects.type, value: copy.type },
    { label: t.projects.role, value: copy.role },
  ];
  if (project.year) facts.push({ label: t.projects.year, value: project.year });
  facts.push({
    label: t.projects.status,
    value: project.status === "live" ? t.projects.live : t.projects.soon,
  });

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-12">
      <p className="max-w-[52ch] text-fg-dim md:col-span-6 md:col-start-2">
        {copy.description}
      </p>

      <dl className="md:col-span-4 md:col-start-9">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex items-baseline justify-between gap-6 border-t border-line-soft py-3 first:border-t-0 first:pt-0"
          >
            <dt className="type-label">{fact.label}</dt>
            <dd className="text-right text-[0.9375rem]">{fact.value}</dd>
          </div>
        ))}
        {showStack && project.stack.length > 0 && (
          <div className="border-t border-line-soft py-3">
            <dt className="type-label">{t.projects.stack}</dt>
            <dd className="mt-3">
              <TechList stack={project.stack} label={t.projects.stack} />
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
