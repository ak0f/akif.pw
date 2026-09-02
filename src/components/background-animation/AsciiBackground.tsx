"use client";

import dynamic from "next/dynamic";

// Three.js is the single largest dependency on the page and nothing above the
// fold depends on it, so the field is split out of the initial bundle and
// mounted client-side only.
const AsciiField = dynamic(() => import("./AsciiField"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="fixed inset-0 z-0 bg-bg" />,
});

export default function AsciiBackground() {
  return <AsciiField />;
}
