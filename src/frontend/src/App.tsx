import { CustomCursor } from "@/components/cursor/CustomCursor";
import { Layout } from "@/components/layout/Layout";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

export default function App() {
  return (
    <>
      <CustomCursor />
      <Layout>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </Layout>
    </>
  );
}
