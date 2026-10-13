"use client";

import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Project } from "@/data/projects";
import Reel from "./Reel";
import TechList from "./TechList";
import ProjectDetails, { Collapse, ToggleMark } from "./ProjectDetails";

/* ---------------------------------------------------------------------------
   A featured project.

   Ruled off at the top like a chapter: number, name and the one-line summary
   on the left, what it is built with and the two actions on the right, then
   the reel. "Details" opens the longer description and the facts between the
   header and the reel, so opening it never sends the reader looking for what
   changed.
--------------------------------------------------------------------------- */
export default function ProjectStage({
  project,
  position,
}: {
  project: Project;
  position: number;
}) {
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const copy = project.copy[locale];
  const panelId = `project-${project.slug}`;
  const soon = project.status === "soon";

  return (
    <article className="border-t border-line pt-6 sm:pt-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-12 md:gap-y-8">
        <p className="type-label tabular md:col-span-1 md:pt-3">
          {String(position).padStart(2, "0")}
        </p>

        <div className="md:col-span-6">
          <h3 className="type-title">{project.title}</h3>
          <p className="type-lead mt-4 max-w-[34ch] md:mt-5">{copy.summary}</p>
          <TechList
            stack={project.stack}
            label={t.projects.stack}
            className="mt-7 md:mt-8"
          />
        </div>

        <div className="mt-4 md:col-span-5 md:mt-0 md:pt-2">
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            {soon && (
              <span className="type-label mr-1 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-[0.4375rem] border border-current"
                />
                {t.projects.soon}
              </span>
            )}
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn group ${soon ? "" : "btn-solid"}`}
            >
              <span className="sr-only">{t.projects.visit} </span>
              {project.displayUrl}
              <ArrowUpRight
                size={15}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={panelId}
              className="btn"
            >
              {open ? t.projects.close : t.projects.details}
              <ToggleMark open={open} />
            </button>
          </div>
        </div>
      </div>

      <Collapse id={panelId} open={open}>
        <div className="pt-10 sm:pt-12">
          <ProjectDetails project={project} />
        </div>
      </Collapse>

      <div className="mt-10 sm:mt-14">
        <Reel
          frames={project.frames}
          href={project.url}
          label={`${t.projects.visit} ${project.title}`}
          cursorLabel={t.projects.visit}
        />
      </div>
    </article>
  );
}
