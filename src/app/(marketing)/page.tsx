import HumanBodySection from "@/components/marketing/HumanBody";
import ADMESection      from "@/components/marketing/ADMESection";
import HowItWorks       from "@/components/marketing/HowItWorks";
import Benefits         from "@/components/marketing/Benefits";

export default function Home() {
  return (
    <div className="flex flex-col bg-black">
      <div id="digital-twin">
        <HumanBodySection />
      </div>

      <div id="adme">
        <ADMESection />
      </div>

      <div id="how-it-works">
        <HowItWorks />
      </div>

      <Benefits />
    </div>
  );
}
