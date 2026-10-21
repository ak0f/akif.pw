"use client";

import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { TECH } from "@/data/tech";
import type { PartKey, Project, ProjectLink } from "@/data/projects";
import TechList from "./TechList";
import { Collapse, ToggleMark } from "./ProjectDetails";

const PART_ORDER: PartKey[] = ["frontend", "backend", "database", "hosting", "auth"];

/** A project with no `links` has one: its own address. */
function linksOf(project: Project): ProjectLink[] {
  if (project.links) return project.links;
  if (!project.url) return [];
  return [
    {
      kind: project.url.includes("github.com") ? "repo" : "site",
      url: project.url,
      displayUrl: project.displayUrl ?? project.url,
    },
  ];
}

/* ---------------------------------------------------------------------------
   A project, as a card that opens.

   Closed it is one ruled line: number, name, the one-line summary, what it is
   built with. The whole line is the control. Opened, the card answers the
   three questions a reader has: what it does, how it is built, and where to
   see it. The image and the layers of the build sit on the left, the words
   and the links on the right, so a project without an image still fills both
   columns.

   Opening is owned by the list, so one card is open at a time and the page
   never grows by more than one card's height.
--------------------------------------------------------------------------- */
export default function ProjectCard({
  project,
  position,
  open,
  onToggle,
}: {
  project: Project;
  position: number;
  open: boolean;
  onToggle: () => void;
}) {
  const { locale, t } = useLanguage();

  const copy = project.copy[locale];
  const panelId = `project-${project.slug}`;
  const soon = project.status === "soon";
  const cover = project.frames[0];
  const links = linksOf(project);
  const parts = PART_ORDER.flatMap((key) =>
    project.parts[key] ? [{ key, value: project.parts[key] as string }] : []
  );

  const facts: { label: string; value: string }[] = [
    { label: t.projects.type, value: copy.type },
    { label: t.projects.role, value: copy.role },
  ];
  if (project.year) facts.push({ label: t.projects.year, value: project.year });
  facts.push({
    label: t.projects.status,
    value:
      project.status === "private"
        ? t.projects.private
        : soon
          ? t.projects.soon
          : t.projects.live,
  });

  return (
    <li className="border-t border-line">
      <div className="group relative grid grid-cols-12 items-start gap-x-6 gap-y-3 py-6 sm:py-8">
        <p className="type-label tabular col-span-2 pt-2 md:col-span-1 md:pt-3">
          {String(position).padStart(2, "0")}
        </p>

        <div className="col-span-8 md:col-span-6">
          <h3 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.035em]">
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              aria-controls={panelId}
              // Stretched over the row, so the whole line is the control.
              className="text-left after:absolute after:inset-0"
            >
              {project.title}
            </button>
          </h3>
          <p className="mt-3 max-w-[44ch] text-[1.0625rem] leading-snug text-fg-dim">
            {copy.summary}
          </p>
        </div>

        <div className="hidden md:col-span-3 md:block md:pt-3">
          <TechList
            // Only technologies with a mark: a bare square says nothing here.
            stack={project.stack.filter((id) => "path" in TECH[id]).slice(0, 6)}
            label={t.projects.stack}
            compact
          />
        </div>

        <div className="col-span-2 flex items-center justify-end gap-3 md:col-span-2 md:pt-1">
          {soon && (
            <span className="type-label hidden items-center gap-2 lg:flex">
              <span
                aria-hidden="true"
                className="size-[0.4375rem] border border-current"
              />
              {t.projects.soon}
            </span>
          )}
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-fg"
          >
            <ToggleMark open={open} />
          </span>
        </div>
      </div>

      <Collapse id={panelId} open={open}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 pt-2 pb-12 md:grid-cols-12 md:pb-16">
          <div className="md:col-span-6 md:col-start-2">
            {cover && (
              <div className="relative aspect-[16/10] overflow-hidden rounded-media bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-white/10 after:ring-inset">
                <Image
                  src={cover}
                  alt={project.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            )}

            {parts.length > 0 && (
              <div className={cover ? "mt-10" : ""}>
                <h4 className="type-label">{t.projects.built}</h4>
                <dl className="mt-4">
                  {parts.map((part) => (
                    <div
                      key={part.key}
                      className="grid grid-cols-[6.5rem_1fr] gap-x-6 border-t border-line-soft py-3 last:border-b sm:grid-cols-[8rem_1fr]"
                    >
                      <dt className="type-label pt-0.5">
                        {t.projects.partLabels[part.key]}
                      </dt>
                      <dd className="text-[0.9375rem]">{part.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[1.0625rem] leading-relaxed text-fg">
              {copy.description}
            </p>

            {copy.points.length > 0 && (
              <>
                <h4 className="type-label mt-10">{t.projects.inside}</h4>
                <ul className="mt-4">
                  {copy.points.map((point) => (
                    <li
                      key={point}
                      className="border-t border-line-soft py-3 text-[0.9375rem] leading-snug text-fg-dim last:border-b"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="type-label">{fact.label}</dt>
                  <dd className="mt-1 text-[0.9375rem]">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {project.clients && (
              <>
                <h4 className="type-label mt-10">{t.projects.clients}</h4>
                <ul className="mt-4">
                  {project.clients.map((client) => (
                    <li
                      key={client.name}
                      className="border-t border-line-soft last:border-b"
                    >
                      <a
                        href={client.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/client block py-3"
                      >
                        <span className="flex items-center justify-between gap-4 font-medium tracking-[-0.01em]">
                          {client.name}
                          <ArrowUpRight
                            size={14}
                            weight="bold"
                            aria-hidden="true"
                            className="shrink-0 transition-transform duration-500 ease-out-expo group-hover/client:translate-x-0.5 group-hover/client:-translate-y-0.5"
                          />
                        </span>
                        <span className="mt-1 block text-[0.9375rem] leading-snug text-fg-dim">
                          {client.note[locale]}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              {links.map((link, i) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn group/visit ${
                    i === 0 && !soon ? "btn-solid" : ""
                  }`}
                >
                  <span className="sr-only">
                    {t.projects.visit} {t.projects.linkLabels[link.kind]}:{" "}
                  </span>
                  {link.displayUrl}
                  <ArrowUpRight
                    size={15}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-500 ease-out-expo group-hover/visit:translate-x-0.5 group-hover/visit:-translate-y-0.5"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Collapse>
    </li>
  );
}
