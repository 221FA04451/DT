"use client";

import { useEffect, useMemo, useState } from "react";
import BodyModel3D from "@/components/dashboard/BodyModel3D";

const patient = {
  id: "OD10576",
  name: "Mr. Arjun R. Krishnamurthy",
  meta: "47 YRS · MALE · T2DM · NASH · CKD-G2",
  facility: "ABC HOSPITALS, HYDERABAD",
  physician: "DR. PRIYA NAIR · DM ENDOCRINOLOGY",
};

type FilterItem = {
  name: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
};

type FilterGroup = {
  title: string;
  items: FilterItem[];
};

const initialFilters: FilterGroup[] = [
  {
    title: "GLYCAEMIC PARAMETERS",
    items: [
      { name: "HbA1c baseline", unit: "%", min: 6, max: 12, step: 0.1, value: 8.6 },
      { name: "Fasting glucose", unit: "mg/dL", min: 80, max: 300, step: 1, value: 168 },
      { name: "HOMA-IR", unit: "", min: 1, max: 15, step: 0.1, value: 7.6 },
    ],
  },
  {
    title: "DOSING PARAMETERS",
    items: [
      { name: "Sema dose (mg)", unit: "mg", min: 0.25, max: 2.4, step: 0.25, value: 1.0 },
      { name: "Weeks elapsed", unit: "W", min: 0, max: 52, step: 1, value: 0 },
    ],
  },
  {
    title: "LIFESTYLE MODIFIERS",
    items: [
      { name: "Exercise days/wk", unit: "d", min: 0, max: 7, step: 1, value: 0 },
      { name: "Sleep quality", unit: "/10", min: 1, max: 10, step: 1, value: 4 },
      { name: "Stress level", unit: "/10", min: 1, max: 10, step: 1, value: 8 },
      { name: "Dietary compliance", unit: "%", min: 0, max: 100, step: 1, value: 35 },
    ],
  },
];

const EMPTY_ORGANS: string[] = [];

const riskTags = [
  { label: "TCF7L2 TT", tone: "red" },
  { label: "KCNQ1 ▲", tone: "red" },
  { label: "ADRB3 Trp64Arg", tone: "amber" },
  { label: "FTO AA", tone: "amber" },
  { label: "GLP1R Het", tone: "cyan" },
  { label: "DPP4 Resistant", tone: "green" },
] as const;

const comorbidityTags = [
  { label: "NASH", tone: "red" },
  { label: "CKD G2", tone: "amber" },
  { label: "Microalbuminuria", tone: "amber" },
  { label: "Hypertriglyc.", tone: "amber" },
  { label: "Hypertension", tone: "cyan" },
  { label: "ASCVD High Risk", tone: "cyan" },
] as const;

const outcomeCards = [
  {
    label: "GLYCAEMIC RESPONSE · HBA1C REDUCTION",
    value: "1.2 – 1.6",
    unit: "%",
    subtitle: "From 8.6% → predicted 7.0–7.4% at 6 months",
    pct: "72% of trial mean",
    note: "Attenuated vs SUSTAIN-6 mean of 1.5% — TCF7L2 TT + KCNQ1 variant. Escalate to 1.0 mg target dose. Fundus review mandatory at Wk 12.",
    fill: 72,
    status: "alert",
  },
  {
    label: "WEIGHT RESPONSE · BODY WEIGHT LOSS",
    value: "3.5 – 5.0",
    unit: "kg",
    subtitle: "3.7–5.3% body weight · est. baseline ~94 kg",
    pct: "58% of trial mean",
    note: "Below trial mean (4–6 kg) — ADRB3 Trp64Arg + sedentary lifestyle. Structured exercise prescription is pharmacologically mandatory.",
    fill: 58,
    status: "warn",
  },
  {
    label: "COMPOSITE SPRA SCORE",
    ring: true,
    verdict: "MODERATE-GOOD",
    target: "Score >60 = therapy beneficial",
    note: "Genetics 12/20 · PK 14/15 · PD 10/15 · Epigenetic 8/15 · Lifestyle 9/20 · Safety 9/15. All lifestyle domains are modifiable.",
  },
];

const reportSections = [
  {
    title: "Clinical Summary",
    subtitle: "PATIENT OVERVIEW · METABOLIC STATUS",
    items: [
      ["HbA1c", "8.6%", "bad"],
      ["FPG", "168 mg/dL", "bad"],
      ["PPG 2h", "242 mg/dL", "bad"],
      ["BMI", "31.4 kg/m²", "warn"],
      ["Waist", "98 cm", "warn"],
      ["HOMA-IR", "7.6", "bad"],
      ["Triglycerides", "312 mg/dL", "bad"],
      ["LDL-C", "138 mg/dL", "warn"],
      ["HDL-C", "36 mg/dL", "warn"],
      ["AST / ALT", "52 / 68 U/L", "warn"],
      ["eGFR", "72 mL/min", "warn"],
      ["Urine ACR", "48 mg/g", "warn"],
      ["Vitamin D", "14 ng/mL", "bad"],
      ["hsCRP", "4.8 mg/L", "warn"],
      ["TSH", "3.2 mIU/L ✓", "ok"],
    ],
  },
  {
    title: "Integrated Assessment",
    subtitle: "DOMAIN SCORES · ACTION POINTS",
    items: [
      ["Pharmacogenomics", "12 / 20", "warn"],
      ["Pharmacokinetics", "14 / 15", "ok"],
      ["Pharmacodynamics", "10 / 15", "warn"],
      ["Epigenetics", "8 / 15", "warn"],
      ["Lifestyle", "9 / 20", "bad"],
      ["Safety Index", "9 / 15", "info"],
      ["Start dose", "0.25 mg Wk 1–4", "info"],
      ["Escalate Wk 5", "0.5 mg", "info"],
      ["Maintenance Wk 17", "1.0 mg", "ok"],
    ],
  },
  {
    title: "Pharmacogenomics",
    subtitle: "GENETIC DETERMINANTS · VARIANT PROFILE",
    items: [
      ["GLP1R Gly168Ser", "Heterozygous", "warn"],
      ["TCF7L2 rs7903146", "TT — Risk carrier", "bad"],
      ["KCNQ1 rs2237892", "Variant allele", "bad"],
      ["ADRB3 Trp64Arg", "Likely (22% freq.)", "warn"],
      ["FTO rs9939609", "AA genotype", "warn"],
      ["DPP4 activity", "DPP4-resistant ✓", "ok"],
      ["MC4R rs17782313", "Not assessed", "info"],
    ],
  },
  {
    title: "Pharmacokinetics",
    subtitle: "PK MODIFIERS · RENAL · INTERACTIONS",
    items: [
      ["Bioavailability SC", "~89%", "ok"],
      ["Half-life", "~168 hrs", "info"],
      ["Protein binding", "~94% albumin", "info"],
      ["Volume of dist.", "~12.5 L", "info"],
      ["Steady state", "Week 5", "info"],
      ["CKD adjustment", "None req. (G2)", "ok"],
      ["CYP450", "No interactions", "ok"],
      ["DDI risk", "LOW — all meds safe", "ok"],
    ],
  },
  {
    title: "Pharmacodynamics",
    subtitle: "EFFICACY MECHANISMS · ORGAN EFFECTS",
    items: [
      ["Insulin secretion", "Attenuated (TCF7L2)", "warn"],
      ["Glucagon suppression", "Active", "ok"],
      ["Gastric emptying", "Delayed — GERD screen", "info"],
      ["Appetite suppression", "Partial (FTO/ADRB3)", "warn"],
      ["NASH hepatic fat", "30–40% ALT↓", "ok"],
      ["Renal ACR", "25–35% ↓", "ok"],
      ["CV MACE risk", "~20% ↓", "ok"],
      ["Beta-cell preserve", "C-peptide @ Wk 0+52", "info"],
    ],
  },
  {
    title: "Epigenetic Factors",
    subtitle: "BIOLOGICAL AGE · GLP1R METHYLATION",
    items: [
      ["Biological age est.", "~54 yr (chron. 47)", "bad"],
      ["GLP1R methylation", "High (visceral fat)", "warn"],
      ["miR-375 (TG-driven)", "Elevated", "bad"],
      ["Histone acetylation", "HDAC suppressed", "warn"],
      ["Gut microbiome", "Dysbiosis (low fibre)", "warn"],
      ["Circadian CLOCK", "Disrupted", "bad"],
      ["Cortisol / HPA", "Dysregulated", "warn"],
      ["VDR–GLP1R axis", "Vit D 14 ng/mL ↓", "bad"],
    ],
  },
  {
    title: "Lifestyle & Environment",
    subtitle: "MODIFIABLE RISK FACTORS",
    items: [
      ["Steps / day", "< 4,000", "bad"],
      ["Sleep duration", "5–6 hrs/night", "bad"],
      ["STOP-BANG", "Score 4 — OSA moderate", "warn"],
      ["Stress level", "High / IT deskwork", "bad"],
      ["Alcohol", "~2 drinks/wk", "warn"],
      ["Diet pattern", "High polished rice", "bad"],
      ["Hydration", "Likely suboptimal", "warn"],
      ["Chennai AQI", "Moderate-poor", "warn"],
    ],
  },
  {
    title: "Safety Assessment",
    subtitle: "RISK STRATIFICATION · MONITORING",
    items: [
      ["GI nausea/vomiting", "MODERATE", "warn"],
      ["Pancreatitis", "LOW-MOD (high TG)", "info"],
      ["Retinopathy worsen.", "MODERATE", "warn"],
      ["Acute kidney injury", "LOW-MOD (CKD G2)", "info"],
      ["Thyroid C-cell", "LOW", "ok"],
      ["Hypoglycaemia", "LOW (no SU/insulin)", "ok"],
      ["Cholelithiasis", "MODERATE (wt loss)", "warn"],
      ["Drug interactions", "LOW", "ok"],
    ],
  },
  {
    title: "India Rx & Protocol",
    subtitle: "MONITORING · DIET · DOSING ALGORITHM",
    items: [
      ["Initiation", "0.25 mg Wk 1–4", "info"],
      ["1st escalation", "0.5 mg Wk 5–16", "info"],
      ["Maintenance", "1.0 mg Wk 17+", "ok"],
      ["Vit D correction", "60K IU/wk × 8 wks", "info"],
      ["B12 supplement", "Methylcobalamin 1500 mcg", "info"],
      ["Diet — replace", "White rice → Millet", "info"],
      ["Exercise rx", "30 min walk 5×/wk", "ok"],
      ["Cost estimate", "₹8,000–12,000 / mo", "warn"],
      ["Storage (Chennai)", "2–8°C; <30°C in use", "warn"],
      ["CDSCO approved", "Ozempic 1.0 mg max", "ok"],
    ],
  },
];

const tagColors = {
  red: "border-[#ff3b3b55] text-[#ff3b3b] bg-[#ff3b3b0d]",
  amber: "border-[#ffaa0055] text-[#ffaa00] bg-[#ffaa000d]",
  green: "border-[#00e67655] text-[#00e676] bg-[#00e6760d]",
  cyan: "border-[#00e5ff30] text-[#00e5ff] bg-[#00e5ff12]",
} as const;

const scoreForWeek = (week: number) => Math.min(80, 62 + Math.floor(week / 3));

const formatSliderValue = (item: FilterItem) => {
  if (item.unit === "%") return `${item.value.toFixed(1)}%`;
  if (item.unit === "/10") return `${item.value.toFixed(0)}/10`;
  if (item.unit === "d") return `${item.value.toFixed(0)}d`;
  if (item.unit === "W") return `W${item.value}`;
  if (item.unit === "mg") return `${item.value.toFixed(2)}mg`;
  if (item.unit === "mg/dL") return `${item.value.toFixed(0)} mg`;
  if (item.unit === "mL/min") return `${item.value.toFixed(0)} mL/min`;
  return item.value.toFixed(item.step < 1 ? 1 : 0);
};

const toneClass = (tone: string) => {
  if (tone === "ok") return "text-[#00e676]";
  if (tone === "warn") return "text-[#ffaa00]";
  if (tone === "bad") return "text-[#ff3b3b]";
  return "text-[#00e5ff]";
};

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterGroup[]>(initialFilters);
  const [clock, setClock] = useState("--:--:--");
  const [pulse, setPulse] = useState(78);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [runLabel, setRunLabel] = useState("▶ RUN SIMULATION");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [vitals, setVitals] = useState({
    bodyTemp: 37.1,
    bloodPressure: [142, 88] as [number, number],
    spO2: 97,
    egfr: 72,
    hscRP: 4.8,
  });

  const weekValue = useMemo(() => filters[1].items[1].value, [filters]);
  const score = useMemo(() => scoreForWeek(weekValue), [weekValue]);

  useEffect(() => {
    const updateTime = () => {
      setClock(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setPulse(74 + Math.round(Math.random() * 9));
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleSliderChange = (groupIndex: number, itemIndex: number, value: string) => {
    const numeric = Number(value);
    setFilters((current) =>
      current.map((group, gi) =>
        gi !== groupIndex
          ? group
          : {
              ...group,
              items: group.items.map((item, ii) => (ii === itemIndex ? { ...item, value: numeric } : item)),
            },
      ),
    );
  };

  const toggleSection = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const runSimulation = () => {
    setRunLabel("RUNNING SIM...");
    setIsSimulating(true);
    setSimProgress(0);

    const weeks = filters[1].items[1].value;
    const exerciseDays = filters[2].items[0].value;

    let elapsed = 0;
    const simInterval = window.setInterval(() => {
      elapsed += 50;
      const progress = Math.min(elapsed / 2000, 1);
      setSimProgress(progress);

      if (progress > 0.1) {
        const tempChange = 0.3 * progress;
        const egfrImprove = 2 * progress * (weeks / 52);
        const pressureLoss = 8 * progress * (1 + exerciseDays * 0.1);

        setVitals({
          bodyTemp: Math.min(37.1 + tempChange, 37.4),
          bloodPressure: [Math.max(142 - pressureLoss, 120), Math.max(88 - pressureLoss * 0.5, 75)],
          spO2: Math.min(97 + progress * 2, 99),
          egfr: Math.min(72 + egfrImprove, 85),
          hscRP: Math.max(4.8 - progress * 2, 2),
        });
      }

      if (progress >= 1) {
        clearInterval(simInterval);
        window.setTimeout(() => {
          setRunLabel("▶ RUN SIMULATION");
          setIsSimulating(false);
        }, 800);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-4 text-white">
      <div className="mx-auto max-w-390">
        <header className="border border-[#00e5ff30] bg-[#050505] shadow-[0_4px_30px_-10px_rgba(0,229,255,0.15)]">
          {/* Top Section */}
          <div className="flex flex-col gap-6 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
            {/* Branding */}
            <div className="flex flex-col justify-center">
              <div className="font-mono text-[1.4rem] font-medium tracking-[0.4em] text-white">
                <span className="text-[#00e5ff]">TWYN</span>360
              </div>
              <div className="mt-1.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[#888888]">
                DIGITAL TWIN SIMULATION PLATFORM - CLINICAL EDITION v2.1
              </div>
            </div>

            {/* Sample ID */}
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[#555555]">SAMPLE ID</div>
              <div className="mt-1 font-mono text-[1.1rem] font-bold tracking-[0.25em] text-[#00e5ff]">{patient.id}</div>
            </div>

            {/* Patient and Status Group */}
            <div className="flex items-stretch justify-end gap-6 pt-2">
              {/* Patient Info */}
              <div className="flex flex-col items-end justify-center text-right">
                <div className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[#555555]">PATIENT</div>
                <div className="mt-0.5 text-[0.95rem] font-medium text-white">{patient.name}</div>
                <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[#888888]">
                  {patient.meta}
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-[#00e5ff40]" />

              {/* Status Info */}
              <div className="flex min-w-50 flex-col items-end justify-center text-right">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e676] animate-pulse" />
                  <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#00e676]">SIM ACTIVE</span>
                </div>
                <div suppressHydrationWarning className="mt-1 font-mono text-[0.7rem] text-[#cccccc]">{clock}</div>
                <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.15em] text-[#555555]">
                  {patient.physician.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section (Sub-header) */}
          <div className="flex flex-col gap-4 border-t border-[#00e5ff30] bg-[#020202] px-6 py-2.5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]" />
              <span className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#00e5ff]">
                SIMULATION WINDOW - PHYSIOLOGICAL DIGITAL TWIN
              </span>
            </div>

            <div className="flex flex-col items-center gap-6 xl:flex-row xl:justify-end">
              <div className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[#555555]">
                SEMAGLUTIDE (OZEMPIC) 0.25 mg → 1.0 mg SC QW
              </div>
              <div className="hidden h-4 w-px bg-[#00e5ff40] xl:block" />
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]" />
                <span className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#00e5ff]">
                  FILTER / PARAMETER TUNING
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-[#00e5ff30] bg-black shadow-[0_0_40px_-20px_rgba(0,229,255,0.15)]">
            <div className="relative overflow-hidden rounded-3xl border-r border-[#00e5ff30] bg-black">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,229,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />
              <div className="relative flex min-h-105 flex-col gap-8 px-6 py-8 xl:px-10">
                <div className="grid gap-6 xl:grid-cols-[160px_1fr_160px]">
                  <div className="space-y-2.5">
                    {[
                      { label: "BODY TEMP", value: vitals.bodyTemp.toFixed(1), unit: "°C", bar: Math.min((vitals.bodyTemp / 37.5) * 100, 100), tone: "cyan" },
                      { label: "BLOOD PRESSURE", value: `${vitals.bloodPressure[0].toFixed(0)}/${vitals.bloodPressure[1].toFixed(0)}`, unit: "mmHg", bar: Math.min((vitals.bloodPressure[0] / 160) * 100, 100), tone: vitals.bloodPressure[0] > 140 ? "amber" : "cyan" },
                      { label: "PULSE RATE", value: `${pulse}`, unit: "bpm", bar: Math.min((pulse / 160) * 100, 100), tone: "cyan" },
                      { label: "SpO₂", value: vitals.spO2.toFixed(0), unit: "%", bar: vitals.spO2, tone: "cyan" },
                      { label: "eGFR", value: vitals.egfr.toFixed(0), unit: "mL/min", bar: vitals.egfr, tone: vitals.egfr > 75 ? "cyan" : "amber" },
                      { label: "hsCRP", value: vitals.hscRP.toFixed(1), unit: "mg/L", bar: Math.min(80 - vitals.hscRP * 8, 100), tone: vitals.hscRP > 3 ? "amber" : "cyan" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-[#00e5ff30] bg-[#0a0a0a] px-3.5 py-2.5">
                        <div className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#b0b0b0]">{item.label}</div>
                        <div className={`mt-1 flex items-baseline text-[0.95rem] font-semibold ${item.tone === "amber" ? "text-[#ffaa00]" : "text-[#00e5ff]"}`}>
                          {item.value}
                          <span className="ml-1.5 text-[0.7rem] font-medium text-[#b0b0b0]">{item.unit}</span>
                        </div>
                        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[#111]">
                          <div className={`h-full transition-all duration-300 ${item.tone === "amber" ? "bg-[#ffaa00]" : "bg-[#00e5ff]"}`} style={{ width: `${item.bar}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative flex items-center justify-center">
                    <BodyModel3D activeOrgans={EMPTY_ORGANS} simulationIntensity={0} />
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { organ: "LIVER", metric: "Hepatic Fat", value: "30-40% ↓", bar: 75 },
                      { organ: "PANCREAS", metric: "Beta-cell", value: "Preserved", bar: 85 },
                      { organ: "STOMACH", metric: "Emptying", value: "Delayed", bar: 45 },
                      { organ: "KIDNEYS", metric: "Renal ACR", value: "25-35% ↓", bar: 65 },
                      { organ: "HEART", metric: "MACE Risk", value: "~20% ↓", bar: 80 },
                      { organ: "BRAIN", metric: "Appetite", value: "Suppressed", bar: 60 },
                    ].map((item) => (
                      <div key={item.organ} className="rounded-xl border border-[#00e5ff30] bg-[#0a0a0a] px-3.5 py-2.5">
                        <div className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#b0b0b0]">
                          {item.organ} RESPONSE
                        </div>
                        <div className="mt-1 flex items-baseline text-[0.85rem] font-semibold text-[#00e5ff]">
                          {item.value}
                          <span className="ml-1.5 text-[0.65rem] font-medium text-[#b0b0b0]">{item.metric}</span>
                        </div>
                        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[#111]">
                          <div
                            className="h-full bg-[#00e5ff] transition-all duration-300"
                            style={{ width: `${simProgress * item.bar}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#00e5ff30] bg-[#0a0a0a] p-4 font-mono text-[0.75rem] uppercase tracking-[0.3em] text-[#00e5ff]">
                  <span className="block">ECG — LIVE RHYTHM</span>
                  <svg className="mt-2 block h-9.5 w-full" viewBox="0 0 700 38" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline
                      points="0,19 35,19 52,17 58,4 64,34 70,19 100,19 135,19 152,17 158,4 164,34 170,19 200,19 235,19 252,17 258,4 264,34 270,19 300,19 335,19 352,17 358,4 364,34 370,19 400,19 435,19 452,17 458,4 464,34 470,19 500,19 535,19 552,17 558,4 564,34 570,19 600,19 635,19 652,17 658,4 664,34 670,19 700,19"
                      fill="none"
                      stroke="#00e5ff"
                      strokeWidth="1.3"
                      opacity="0.75"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col overflow-hidden rounded-3xl border border-[#00e5ff30] bg-[#0a0a0a] shadow-[0_0_40px_-20px_rgba(0,229,255,0.15)]">
            <div className="rounded-t-3xl border-b border-[#00e5ff30] bg-[#0a0a0a] px-5 py-4 font-mono text-[0.75rem] uppercase tracking-[0.3em] text-[#00e5ff]">
              PARAMETER TUNING
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {filters.map((group, gi) => (
                <div key={group.title} className="mb-5">
                  <div className="mb-3 border-b border-[#00e5ff30] pb-2 text-[0.65rem] uppercase tracking-[0.35em] text-[#00e5ff]">
                    {group.title}
                  </div>
                  {group.items.map((item, ii) => (
                    <div key={item.name} className="mb-3 flex items-center gap-2 text-sm text-[#b0b0b0]">
                      <div className="min-w-32 text-[0.75rem] text-[#b0b0b0]">{item.name}</div>
                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        value={item.value}
                        onChange={(event) => handleSliderChange(gi, ii, event.target.value)}
                        className="h-1 w-16 appearance-none rounded-full bg-[#303030] accent-[#00e5ff]"
                      />
                      <div className="min-w-12 text-right font-mono text-[0.7rem] uppercase tracking-[0.25em] text-[#00e5ff]">
                        {formatSliderValue(item)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="mb-5">
                <div className="mb-3 border-b border-[#00e5ff30] pb-2 text-[0.65rem] uppercase tracking-[0.35em] text-[#00e5ff]">
                  GENETIC RISK FLAGS
                </div>
                <div className="flex flex-wrap gap-2">
                  {riskTags.map((tag) => (
                    <span key={tag.label} className={`rounded-full border px-3 py-1 text-[0.65rem] ${tagColors[tag.tone]}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-3 border-b border-[#00e5ff30] pb-2 text-[0.65rem] uppercase tracking-[0.35em] text-[#00e5ff]">
                  COMORBIDITY FLAGS
                </div>
                <div className="flex flex-wrap gap-2">
                  {comorbidityTags.map((tag) => (
                    <span key={tag.label} className={`rounded-full border px-3 py-1 text-[0.65rem] ${tagColors[tag.tone]}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={runSimulation}
              disabled={isSimulating}
              className="mx-5 mb-5 rounded-2xl border border-[#00e5ff] bg-transparent px-4 py-3 font-mono text-[0.75rem] uppercase tracking-[0.35em] text-[#00e5ff] transition hover:bg-[#00e5ff12] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {runLabel}
            </button>
          </section>
        </div>

        <section className="rounded-3xl border border-[#00e5ff30] bg-[#0a0a0a] px-5 py-4 font-mono text-[0.75rem] uppercase tracking-[0.3em] text-[#00e5ff] shadow-[0_0_40px_-20px_rgba(0,229,255,0.18)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#00e5ff]" />
              <span>PREDICTED TREATMENT OUTCOMES AT 6 MONTHS</span>
            </div>
            <div className="text-[#b0b0b0]">SPRA v1.4 · SUSTAIN-6 CALIBRATED · SOUTH INDIAN PHENOTYPE</div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-3">
          {outcomeCards.map((card, index) => (
            <article key={index} className="relative overflow-hidden rounded-3xl border border-[#00e5ff30] bg-black px-6 py-6 shadow-[0_0_40px_-20px_rgba(0,229,255,0.2)]">
              <div className="absolute inset-x-0 top-0 h-px bg-[#00e5ff]" />
              <div className="relative pt-3">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-[#b0b0b0]">{card.label}</div>
                {card.ring ? (
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#00e5ff] bg-[#0a0a0a] text-[1.65rem] font-semibold text-[#00e5ff]">
                      {score}
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">{card.verdict}</div>
                      <div className="text-sm text-[#b0b0b0]">{card.target}</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-6 flex items-end gap-2 text-4xl font-semibold text-white">
                      {card.value}
                      <span className="text-lg font-normal text-[#b0b0b0]">{card.unit}</span>
                    </div>
                    <div className="mt-2 text-sm text-[#b0b0b0]">{card.subtitle}</div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 overflow-hidden rounded-full bg-[#111]">
                        <div className="h-1.5 rounded-full bg-[#00e5ff]" style={{ width: `${card.fill}%` }} />
                      </div>
                      <div className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-[#b0b0b0]">{card.pct}</div>
                    </div>
                  </>
                )}
                <p className="mt-5 text-[0.82rem] leading-6 text-[#b0b0b0]">{card.note}</p>
              </div>
            </article>
          ))}
        </div>

        <section className="rounded-3xl border border-[#00e5ff30] bg-[#0a0a0a] px-5 py-4 font-mono text-[0.75rem] uppercase tracking-[0.3em] text-[#00e5ff] shadow-[0_0_40px_-20px_rgba(0,229,255,0.18)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#00e5ff]" />
              <span>FULL REPORT SECTIONS — EXPAND TO VIEW</span>
            </div>
            <div className="text-[#b0b0b0]">SECTIONS §1 – §12 · ABC HOSPITALS, HYDERABAD · CONFIDENTIAL</div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-3">
          {reportSections.map((section, index) => (
            <div key={section.title} className="overflow-hidden rounded-3xl border border-[#00e5ff30] bg-black shadow-[0_0_40px_-20px_rgba(0,229,255,0.18)]">
              <button
                type="button"
                onClick={() => toggleSection(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-[#0a0a0a]"
              >
                <div className="flex items-center gap-4">
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-[#00e5ff]">
                    § {index < 8 ? String(index + 1).padStart(2, "0") : "09–12"}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{section.title}</div>
                    <div className="text-[0.8rem] text-[#b0b0b0]">{section.subtitle}</div>
                  </div>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#00e5ff30] text-[#00e5ff] transition-transform duration-150 ${openIndex === index ? "rotate-45" : ""}`}>
                  {openIndex === index ? "×" : "+"}
                </div>
              </button>
              <div className={`${openIndex === index ? "block" : "hidden"} border-t border-[#00e5ff30] bg-[#0a0a0a] px-5 py-4`}>
                <div className="space-y-3">
                  {section.items.map(([label, value, tone]) => (
                    <div key={`${section.title}-${label}`} className="flex items-center justify-between gap-4 text-sm text-white">
                      <span className="text-[#b0b0b0]">{label}</span>
                      <span className={`font-semibold ${toneClass(tone)}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="rounded-3xl border border-[#00e5ff30] bg-[#0a0a0a] px-5 py-4 text-[0.75rem] text-[#b0b0b0] shadow-[0_0_40px_-20px_rgba(0,229,255,0.18)]">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>TWYN360 DIGITAL TWIN PLATFORM · ABC HOSPITALS HYDERABAD · CONFIDENTIAL — FOR CLINICIAN USE ONLY</div>
            <div>
              REPORT REF: <span className="text-[#00e5ff]">AIMS-OPD-2025-04872</span> · ASSESSMENT:{" "}
              <span className="text-[#00e5ff]">10 JUNE 2025</span> · ENGINE:{" "}
              <span className="text-[#00e5ff]">SPRA v1.4</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
