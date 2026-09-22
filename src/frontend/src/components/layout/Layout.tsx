import { AmbientParticles } from "@/components/background/AmbientParticles";
import { ShootingStars } from "@/components/background/ShootingStars";
import { Starfield } from "@/components/background/Starfield";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

/**
 * App shell: fixed cosmic background layers, sticky nav, main content, footer.
 * Background layers sit at -z-10 so content always composites above them.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Starfield />
      <AmbientParticles />
      <ShootingStars />
      <Nav />
      <main
        id="main-content"
        data-ocid="page.main"
        className="relative z-10 flex-1 pt-24"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
