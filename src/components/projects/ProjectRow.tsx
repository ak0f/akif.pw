"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Project } from "@/data/projects";
import TechList from "./TechList";
import { Collapse, ToggleMark } from "./ProjectDetails";

/* ---------------------------------------------------------------------------
   A project in the compact list.

   One ruled line when closed: name, what it is, what it is built with, and a
   way out to the real thing. The whole line opens it; the visit link sits on
   top of that hit area so it stays a separate, single click. Opened, the row
   shows its image, the description and the same facts a featured project has.

   The list is what keeps the section from growing a full screen taller with
   every project added.
--------------------------------------------------------------------------- */
export default function ProjectRow({ project }: { project: Project }) {
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const copy = project.copy[locale];
  const panelId = `project-${project.slug}`;
  const cover = project.frames[0];

  return (
    <li className="border-t border-line">
      <div className="group relative grid grid-cols-12 items-center gap-x-6 py-5 sm:py-6">
        <h4 className="col-span-8 text-[clamp(1.375rem,2.5vw,2rem)] leading-[1.1] font-medium tracking-[-0.032em] md:col-span-4">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={panelId}
            // Stretched over the row, so the whole line is the control.
            className="text-left after:absolute after:inset-0"
          >
            {project.title}
          </button>
        </h4>

        <p className="hidden text-[0.9375rem] text-fg-dim md:col-span-3 md:block">
          {copy.type}
        </p>

        <div className="hidden md:col-span-3 md:block">
          <TechList stack={project.stack} label={t.projects.stack} compact />
        </div>

        <div className="col-span-4 flex items-center justify-end gap-2 md:col-span-2">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.projects.visit} ${project.title}`}
            className="relative z-10 flex size-11 items-center justify-center rounded-full border border-line text-fg transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg"
          >
            <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </a>
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-fg"
          >
            <ToggleMark open={open} />
          </span>
        </div>
      </div>

      <Collapse id={panelId} open={open}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 pt-2 pb-10 md:grid-cols-12 md:pb-14">
          {cover && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-media bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-white/10 after:ring-inset md:col-span-6">
              <Image
                src={cover}
                alt={project.title}
                fill
                sizes="(min-width: 768px) 46vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          )}

          <div className="md:col-span-5 md:col-start-8">
            <p className="type-lead text-fg">{copy.summary}</p>
            <p className="mt-5 max-w-[52ch] text-fg-dim">{copy.description}</p>

            <dl className="mt-8">
              <div className="flex items-baseline justify-between gap-6 border-t border-line-soft py-3">
                <dt className="type-label">{t.projects.role}</dt>
                <dd className="text-right text-[0.9375rem]">{copy.role}</dd>
              </div>
              {project.stack.length > 0 && (
                <div className="flex items-center justify-between gap-6 border-t border-line-soft py-3">
                  <dt className="type-label">{t.projects.stack}</dt>
                  <dd>
                    <TechList
                      stack={project.stack}
                      label={t.projects.stack}
                      className="justify-end"
                    />
                  </dd>
                </div>
              )}
            </dl>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid group/visit mt-8"
            >
              <span className="sr-only">{t.projects.visit} </span>
              {project.displayUrl}
              <ArrowUpRight
                size={15}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-500 ease-out-expo group-hover/visit:translate-x-0.5 group-hover/visit:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </Collapse>
    </li>
  );
}
