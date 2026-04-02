import HumanBodySection from "@/components/features/HumanBody";

import ADMESection      from "@/components/features/ADMESection";
import HowItWorks       from "@/components/features/HowItWorks";
import Benefits         from "@/components/features/Benefits";

export default function Home() {
  return (
    <div className="flex flex-col bg-black">
      <div id="digital-twin">
        <HumanBodySection />
      </div>

      <div id="adme">
        <ADMESection />
      </div>
      <HowItWorks />
      <Benefits />
    </div>
  );
}
