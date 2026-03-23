import ADMESection from "@/components/features/ADMESection";

export const metadata = {
  title: "Pharmacokinetics | Digital Twin",
  description: "Explore the ADME process (Absorption, Distribution, Metabolism, Excretion) in our high-fidelity human body simulation.",
};

export default function PharmacokineticsPage() {
  return (
    <div className="pt-24 min-h-screen bg-black">
      <ADMESection />
    </div>
  );
}
