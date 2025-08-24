import { useContent } from "./useContent";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import SectionHeader from "./components/SectionHeader";

export default function App() {
  const { content, loading, error } = useContent();
  if (error) return <div style={{ padding: 24 }}>Failed to load content.</div>;
  if (loading || !content) return null;

  const { site } = content;

  return (
    <>
      <main>
        <section id="home" className="section" aria-label="Hero">
          <Hero />
        </section>

        <section id="about" className="section" aria-label="About">
          <SectionHeader title="About" />
          <About />
        </section>

        <section id="projects" className="section" aria-label="Projects">
          <SectionHeader title="Projects" />
          <Projects />
        </section>

        <section id="contact" className="section" aria-label="Contact">
          <SectionHeader title="Contact" />
          <Contact />
        </section>
      </main>
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {site.name} - {site.role}
        </p>
      </footer>
    </>
  );
}
