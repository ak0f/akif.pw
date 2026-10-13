"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { skillCategories, type SkillItem } from "@/i18n/dictionaries";
import RevealText from "@/components/text-animation/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";

type SortMode = "category" | "level";

/* ---------------------------------------------------------------------------
   Capabilities.

   Ten real skills, each with the level I give myself. The number is the point
   of the section: claiming a skill is cheap, so the figure next to it is what
   makes the claim worth reading, and 25% stated plainly is more convincing
   than "proficient".

   The rule under each entry is the meter. It is drawn to the level and capped
   with the square from the mark, so the lines that divide the list are the
   same lines that carry the data, and no separate bar is needed.

   Two things move:

   - On first sight each rule draws out to its level while the figure counts
     up beside it. One value drives both, so they cannot drift apart.
   - The sort control re-ranks the list. By category is the honest structure;
     by level answers what a reader actually wants to know, and turns the
     rules into a descending chart. Entries travel to their new place under
     `layout`, so the re-rank reads as a re-rank and not as a cut.

   Everything is readable without hover and under reduced motion.
--------------------------------------------------------------------------- */
export default function Skills() {
  const { t } = useLanguage();
  const [sort, setSort] = useState<SortMode>("category");

  const listRef = useRef<HTMLUListElement>(null);
  // Once: the meters resolve one time, on the first pass through the section.
  const revealed = useInView(listRef, { once: true, amount: 0.08 });

  const ordered = useMemo(() => {
    const items = t.skills.items;
    if (sort === "level") {
      return [...items].sort((a, b) => b.level - a.level);
    }
    // Category order is fixed by the dictionary, not by whatever order the
    // items happen to sit in.
    return skillCategories.flatMap((category) =>
      items.filter((item) => item.category === category)
    );
  }, [t.skills.items, sort]);

  const modes: { key: SortMode; label: string }[] = [
    { key: "category", label: t.skills.sortByCategory },
    { key: "level", label: t.skills.sortByLevel },
  ];

  return (
    <section id="skills" className="py-28 sm:py-44">
      <div className="wrap">
        <header className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <SectionLabel>
              {t.skills.eyebrow}
              <span aria-hidden="true">·</span>
              <span className="tabular">{t.skills.count}</span>
            </SectionLabel>
            <RevealText
              as="h2"
              text={t.skills.heading}
              className="type-display mt-7 max-w-[17ch] text-[clamp(2rem,5.2vw,4.5rem)]"
            />
          </div>

          <div className="md:col-span-4 md:self-end">
            <p className="type-lead max-w-[30ch]">{t.skills.note}</p>

            {/* Segmented control: two states of one list, so one pill that
                slides between them rather than two separate buttons. */}
            <div
              role="group"
              aria-label={t.skills.sortLabel}
              className="mt-7 inline-flex rounded-full border border-line p-1"
            >
              {modes.map((mode) => {
                const selected = sort === mode.key;
                return (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={() => setSort(mode.key)}
                    aria-pressed={selected}
                    className={`relative flex h-9 items-center rounded-full px-4 text-[0.875rem] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                      selected ? "text-bg" : "text-fg-dim hover:text-fg"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="skills-sort"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-fg"
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <span className="relative">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <ul ref={listRef} className="mt-16 sm:mt-24">
          {ordered.map((item, i) => (
            <SkillRow
              key={item.name}
              item={item}
              position={i}
              revealed={revealed}
              categoryLabel={t.skills.categories[item.category]}
              levelLabel={t.skills.levelLabel}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

interface SkillRowProps {
  item: SkillItem;
  position: number;
  revealed: boolean;
  categoryLabel: string;
  levelLabel: string;
}

function SkillRow({
  item,
  position,
  revealed,
  categoryLabel,
  levelLabel,
}: SkillRowProps) {
  const reduce = useReducedMotion();

  // One value for both the figure and the rule.
  const level = useMotionValue(0);
  const shown = useTransform(level, (value) => Math.round(value));
  const width = useTransform(level, (value) => `${value}%`);

  // The stagger is fixed to where the entry sat on first paint. Without this
  // the re-rank would restart every meter, and the section would replay itself
  // each time the reader touches the sort control. Held in state rather than a
  // ref so it can be read during render.
  const [stagger] = useState(() => position * 0.07);
  const counted = useRef(false);

  useEffect(() => {
    if (!revealed || counted.current) return;
    counted.current = true;

    if (reduce) {
      level.set(item.level);
      return;
    }

    const controls = animate(level, item.level, {
      duration: 1.5,
      delay: stagger + 0.15,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [revealed, reduce, item.level, level, stagger]);

  return (
    <motion.li
      layout
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="grid grid-cols-12 items-end gap-x-6 gap-y-3 pt-9 pb-7 sm:pt-11 sm:pb-8">
        <div className="col-span-8 md:col-span-4">
          <h3 className="text-[clamp(1.375rem,2.5vw,2rem)] leading-[1.1] font-medium tracking-[-0.032em]">
            {item.name}
          </h3>
          <p className="type-label mt-2">{categoryLabel}</p>
        </div>

        <p className="order-last col-span-12 max-w-[46ch] text-[0.9375rem] text-fg-dim md:order-none md:col-span-5">
          {item.desc}
        </p>

        <p
          aria-hidden="true"
          className="tabular col-span-4 text-right text-[clamp(2rem,4.6vw,3.75rem)] leading-[0.9] font-medium tracking-[-0.045em] md:col-span-3"
        >
          <motion.span>{shown}</motion.span>
          <span className="ml-1 text-[0.45em] tracking-normal text-fg-faint">
            %
          </span>
        </p>
      </div>

      <div
        role="meter"
        aria-valuenow={item.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${levelLabel}, ${item.name}`}
        className="relative h-px bg-line"
      >
        <motion.span
          aria-hidden="true"
          style={{ width }}
          className="absolute inset-y-0 left-0 bg-fg"
        >
          <span className="absolute top-1/2 right-0 size-[7px] translate-x-1/2 -translate-y-1/2 bg-fg" />
        </motion.span>
      </div>
    </motion.li>
  );
}
