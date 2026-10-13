"use client";

import { useMemo } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { GITHUB_URL } from "@/i18n/dictionaries";
import {
  FEATURED_PROJECTS,
  OTHER_PROJECTS,
  PROJECTS,
} from "@/data/projects";
import { LANGUAGE_TECH } from "@/data/tech";
import type { Repo } from "@/lib/github";
import RevealText from "@/components/text-animation/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectStage from "@/components/projects/ProjectStage";
import ProjectRow from "@/components/projects/ProjectRow";
import { TechIcon } from "@/components/projects/TechList";

/* ---------------------------------------------------------------------------
   Projects.

   Three tiers, each in the shape that suits it:

   - Featured projects get a stage each: a ruled header and a reel of the real
     site that winds as the page scrolls.
   - Everything else curated sits in a compact list, one line per project,
     each opening for detail.
   - The repositories follow, read live from GitHub, so a new push appears
     here without anyone editing the site.

   The first two come from one file, src/data/projects.ts. Adding a project is
   adding an object there; this component never needs to change.
--------------------------------------------------------------------------- */
export default function Projects({ repos }: { repos: Repo[] }) {
  const { locale, t } = useLanguage();

  // A repository that already has a curated entry is not listed a second time.
  const listed = useMemo(() => {
    const curated = new Set(
      PROJECTS.flatMap((project) =>
        project.repo ? [project.repo.toLowerCase()] : []
      )
    );
    return repos.filter((repo) => !curated.has(repo.name.toLowerCase()));
  }, [repos]);

  const formatDate = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "numeric",
    });
    return (iso: string) => format.format(new Date(iso));
  }, [locale]);

  const counts = [
    t.projects.countProjects.replace("{n}", String(PROJECTS.length)),
    ...(listed.length
      ? [t.projects.countRepos.replace("{n}", String(listed.length))]
      : []),
  ];

  return (
    <section id="projects" className="pt-28 pb-28 sm:pt-44 sm:pb-44">
      <div className="wrap">
        <header className="grid grid-cols-1 gap-x-6 gap-y-10 pb-20 sm:pb-32 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionLabel>{t.projects.eyebrow}</SectionLabel>
            <RevealText
              as="h2"
              text={t.projects.heading}
              className="type-display mt-7 max-w-[11ch]"
            />
          </div>

          <div className="md:col-span-4 md:col-start-9 md:self-end">
            <p className="type-lead">{t.projects.intro}</p>
            <p className="type-label tabular mt-6">{counts.join(" · ")}</p>
          </div>
        </header>

        <div className="flex flex-col gap-28 sm:gap-44">
          {FEATURED_PROJECTS.map((project, i) => (
            <ProjectStage
              key={project.slug}
              project={project}
              position={i + 1}
            />
          ))}
        </div>

        {OTHER_PROJECTS.length > 0 && (
          <div className="mt-32 grid grid-cols-1 gap-x-6 gap-y-8 sm:mt-52 md:grid-cols-12">
            <h3 className="text-[1.375rem] leading-tight font-medium tracking-[-0.028em] md:col-span-3">
              {t.projects.moreHeading}
            </h3>
            <ul className="border-b border-line md:col-span-9">
              {OTHER_PROJECTS.map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </ul>
          </div>
        )}

        <div className="mt-24 grid grid-cols-1 gap-x-6 gap-y-8 sm:mt-32 md:grid-cols-12">
          <div className="md:col-span-3">
            <h3 className="text-[1.375rem] leading-tight font-medium tracking-[-0.028em]">
              {t.projects.reposHeading}
            </h3>
            <p className="type-label mt-3 max-w-[24ch]">
              {t.projects.reposNote}
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium"
            >
              <span className="link-draw">{t.projects.viewAll}</span>
              <ArrowUpRight
                size={15}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>

          {listed.length > 0 ? (
            <ul className="border-b border-line-soft md:col-span-9">
              {listed.map((repo) => {
                const tech = repo.language
                  ? LANGUAGE_TECH[repo.language]
                  : undefined;
                return (
                  <li key={repo.name} className="border-t border-line-soft">
                    <a
                      href={repo.homepage ?? repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group grid grid-cols-12 items-baseline gap-x-6 gap-y-1.5 py-4 sm:py-5"
                    >
                      <span className="col-span-8 font-medium tracking-[-0.015em] md:col-span-3">
                        <span className="link-draw">{repo.name}</span>
                      </span>
                      <span className="order-last col-span-12 text-[0.9375rem] text-fg-dim md:order-none md:col-span-5">
                        {repo.description ?? t.projects.noDescription}
                      </span>
                      <span className="hidden items-center gap-2 self-center text-[0.9375rem] text-fg-dim md:col-span-2 md:flex">
                        {tech ? (
                          <TechIcon id={tech} />
                        ) : (
                          // No language reported: the square keeps the column aligned.
                          <span
                            aria-hidden="true"
                            className="flex size-[1.125rem] items-center justify-center"
                          >
                            <span className="size-[0.4375rem] bg-current" />
                          </span>
                        )}
                        {repo.language ?? t.projects.repoLabel}
                      </span>
                      <span className="type-label tabular col-span-4 flex items-center justify-end gap-2.5 self-center md:col-span-2">
                        <span>
                          <span className="sr-only">
                            {t.projects.updatedLabel}{" "}
                          </span>
                          {formatDate(repo.updated)}
                        </span>
                        <ArrowUpRight
                          size={14}
                          weight="bold"
                          aria-hidden="true"
                          className="text-fg transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-fg-dim md:col-span-9">{t.projects.empty}</p>
          )}
        </div>
      </div>
    </section>
  );
}
