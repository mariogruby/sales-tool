import { Hero } from "./components/hero/hero";
import { Steps } from "./components/steps/steps";
import Features from "./components/features/features";
import Gallery from "./components/gallery/gallery";
import Cta from "./components/cta/cta";
import HomeNavbar from "@/components/layout/home-navbar";
import HomeFooter from "@/components/layout/home-footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />
      <main className="flex-1">
        <Hero />
        <Steps />
        <Features />
        <Gallery />
        <Cta />
      </main>
      <HomeFooter />
    </div>
  );
}
