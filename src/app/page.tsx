import Preloader from "@/components/Preloader";
import AsciiBackground from "@/components/background-animation/AsciiBackground";
import Cursor from "@/components/ui/Cursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getRepos } from "@/lib/github";

/** Repositories are re-read hourly, so a new push reaches the page on its own. */
export const revalidate = 3600;

export default async function Home() {
  const repos = await getRepos();

  return (
    <>
      <Preloader />
      <AsciiBackground />
      <Cursor />
      <ScrollProgress />
      <Nav />

      <main className="relative">
        <Hero />
        <Projects repos={repos} />
        <Skills />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
