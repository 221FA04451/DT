import HeroSection          from "@/components/features/HeroSection";
import ProductOverview      from "@/components/features/ProductOverview";
import HumanBodySection     from "@/components/features/HumanBody";
import ADMESection          from "@/components/features/ADMESection";
import AboutSection         from "@/components/features/AboutSection";
import HowItWorks           from "@/components/features/HowItWorks";
import Benefits             from "@/components/features/Benefits";


export default function Home() {
  return (
    <div className="flex flex-col bg-black">
      <HeroSection />
      <ProductOverview />
      <div id="digital-twin">
        <HumanBodySection />
      </div>
      <div id="adme">
        <ADMESection />
      </div>
      <AboutSection />
      <HowItWorks />
      <Benefits />
    </div>
  );
}
