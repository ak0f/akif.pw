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
import ScrambleText from "@/components/text-animation/ScrambleText";

/** Segments in one proficiency meter. 20 keeps every 5% step readable. */
const SEGMENTS = 20;

type SortMode = "category" | "level";

/* ---------------------------------------------------------------------------
   Capabilities.

   Ten real skills, each with the self-assessed level that already exists on
   akif.pw. The meter is the point of the section: claiming a skill is cheap,
   so the number next to it is what makes the claim worth reading, and 25%
   stated plainly is more convincing than "proficient".

   Every entry is a single centred column, one thing under the next, with the
   description held to a comfortable measure. The earlier version split each
   row into four narrow side-by-side columns, which broke the sentences into
   one or two words per line and made them work to read.

   Two things carry the interaction:

   - The meters boot up on scroll, segment by segment, and the numbers count
     with them. It reads as a readout resolving rather than a bar sliding.
   - The sort toggle re-ranks the list. By category is the honest structure;
     by level answers the question a reader actually has, which is "what is he
     best at". Entries travel to their new position under `layout`, so the
     re-rank is legible instead of a jump cut.

   Everything is fully readable without hover, without JavaScript settling and
   under reduced motion. The inversion is emphasis, not disclosure.
--------------------------------------------------------------------------- */
export default function Skills() {
  const { t } = useLanguage();
  const [sort, setSort] = useState<SortMode>("category");

  const listRef = useRef<HTMLUListElement>(null);
  // Once: the meters resolve one time, on the first pass through the section.
  const revealed = useInView(listRef, { once: true, amount: 0.05 });

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
    <section id="skills" className="relative z-10 py-28 sm:py-44">
      <div className="mx-auto max-w-[820px] px-5 text-center sm:px-10">
        <div className="flex flex-col items-center gap-3">
          <ScrambleText text={t.skills.eyebrow} className="type-label" />
          <ScrambleText text={t.skills.count} className="type-label" />
        </div>

        <RevealText
          as="h2"
          text={t.skills.heading}
          className="type-display mx-auto mt-7 max-w-[20ch] text-[clamp(1.6rem,3.6vw,2.8rem)]"
        />

        <p className="mx-auto mt-7 max-w-[46ch] text-sm leading-relaxed text-fg-dim">
          {t.skills.note}
        </p>

        {/* Sort control, set in the same slash-separated idiom as the language
            switcher in the header so it reads as a control, not a button row. */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-16">
          <span className="type-label">{t.skills.sortLabel}</span>
          <div className="type-meta flex items-center gap-2.5">
            {modes.map((mode, i) => (
              <span key={mode.key} className="flex items-center gap-2.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-fg-faint">
                    /
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSort(mode.key)}
                  aria-pressed={sort === mode.key}
                  className={`relative py-1 transition-colors ${
                    sort === mode.key
                      ? "text-fg"
                      : "text-fg-faint hover:text-fg"
                  }`}
                >
                  {mode.label}
                  {sort === mode.key && (
                    <motion.span
                      layoutId="skills-sort-underline"
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-0.5 h-px bg-fg"
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              </span>
            ))}
          </div>
        </div>

        <ul ref={listRef} className="mt-10 sm:mt-14">
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

        <div className="rule" />
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

  const count = useMotionValue(0);
  const shown = useTransform(count, (value) => Math.round(value));

  const filled = Math.round((item.level / 100) * SEGMENTS);

  // The stagger is fixed to where the entry sat on first paint. Without this
  // the re-rank would restart every meter, and the section would replay itself
  // each time the reader touches the sort control. Held in state rather than a
  // ref so it can be read during render.
  const [stagger] = useState(() => position * 0.055);
  const counted = useRef(false);

  useEffect(() => {
    if (!revealed || counted.current) return;
    counted.current = true;

    if (reduce) {
      count.set(item.level);
      return;
    }

    const controls = animate(count, item.level, {
      duration: 1,
      delay: stagger + 0.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [revealed, reduce, item.level, count, stagger]);

  return (
    <motion.li
      layout
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="rule group relative"
    >
      {/* Inversion panel. On a two-colour page, swapping ground for figure is
          the strongest emphasis available without introducing a tint, and it
          raises contrast rather than lowering it. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -inset-x-4 origin-left scale-x-0 bg-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 sm:-inset-x-8"
      />

      <div className="relative flex flex-col items-center py-7 transition-colors duration-500 group-hover:text-bg sm:py-8">
        <span className="type-meta text-fg-faint transition-colors duration-500 group-hover:text-bg/55">
          {String(position + 1).padStart(2, "0")}
        </span>

        <h3 className="type-display mt-3 text-[clamp(1.15rem,2.4vw,1.65rem)]">
          {item.name}
        </h3>

        <p className="type-label mt-2.5 transition-colors duration-500 group-hover:text-bg/65">
          {categoryLabel}
        </p>

        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-fg-dim transition-colors duration-500 group-hover:text-bg/80">
          {item.desc}
        </p>

        <div
          role="meter"
          aria-valuenow={item.level}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${levelLabel}, ${item.name}`}
          className="mt-5 w-full max-w-[280px]"
        >
          <div aria-hidden="true" className="flex items-end gap-[3px]">
            {Array.from({ length: SEGMENTS }, (_, s) => (
              <span
                key={s}
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "scaleY(1)" : "scaleY(0.2)",
                  transitionDelay: `${stagger + s * 0.022}s`,
                }}
                className={`h-3 flex-1 origin-bottom transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  s < filled
                    ? "bg-fg group-hover:bg-bg"
                    : "bg-fg/25 group-hover:bg-bg/30"
                }`}
              />
            ))}
          </div>

          <p
            aria-hidden="true"
            className="type-meta mt-2.5 flex items-baseline justify-center gap-2.5"
          >
            <span className="text-fg-faint transition-colors duration-500 group-hover:text-bg/55">
              {levelLabel}
            </span>
            <span className="tabular-nums">
              <motion.span>{shown}</motion.span>%
            </span>
          </p>
        </div>
      </div>
    </motion.li>
  );
}
