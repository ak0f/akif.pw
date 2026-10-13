import Intro from "@/components/Intro";
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
      <Intro />
      <Nav />

      <main>
        <Hero />

        {/* Pulled up by one screen: the hero is two screens tall and sticky,
            and this sheet travels over it during the second one. */}
        <div className="sheet -mt-[100svh]">
          <Projects repos={repos} />
          <Skills />
          <About />
          <Contact />
        </div>
      </main>

      <div className="relative z-10 bg-bg">
        <Footer />
      </div>
    </>
  );
}
