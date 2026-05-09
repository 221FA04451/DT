'use client';

import { useEffect, useState } from "react";

const ALERT_COUNT = 5;

export default function TopNav() {
  const [time, setTime] = useState("--:--:--");
  const [showAlertPop, setShowAlertPop] = useState(false);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-black border-b border-[#00e5ff60] shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-5">
        <div>
          <div className="font-share-tech text-[22px] text-[#00e5ff] tracking-[6px] leading-none">
            TWYN<span className="text-white font-bold">360</span>
          </div>
          <div className="font-share-tech text-[8px] text-[#606060] tracking-[2px] mt-[3px]">
            DIGITAL TWIN SIMULATION PLATFORM — CLINICAL EDITION v2.1
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-9 bg-[#00e5ff30]" />

        {/* Patient ID badge */}
        <div>
          <div className="font-share-tech text-[7px] text-[#606060] tracking-[2px] mb-[2px]">PATIENT ID</div>
          <div className="font-share-tech text-[16px] text-[#00e5ff] tracking-[4px] font-bold leading-none">OD10576</div>
        </div>
      </div>

      {/* Center — patient info strip */}
      <div className="hidden lg:flex flex-col items-center">
        <div className="text-[14px] font-semibold text-white tracking-[0.5px]">
          Mr. Arjun R. Krishnamurthy
        </div>
        <div className="font-share-tech text-[9px] text-[#b0b0b0] mt-[2px]">
          47 YRS · MALE · T2DM · NASH · CKD-G2 · ABC HOSPITALS, HYDERABAD
        </div>
        <div className="flex gap-2 mt-1.5">
          {["HbA1c 8.6%", "TG 312", "BMI 31.4", "NASH", "CKD-G2"].map((tag, i) => (
            <div
              key={tag}
              className="font-share-tech text-[7px] px-1.5 py-0.5 border"
              style={{
                borderColor: i < 2 ? "#ff3b3b55" : "#ffaa0055",
                color: i < 2 ? "#ff3b3b" : "#ffaa00",
                background: i < 2 ? "#ff3b3b0d" : "#ffaa000d",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Right block */}
      <div className="flex items-center gap-4">
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="font-share-tech text-[8px] text-[#606060] border border-[#303030] px-2.5 py-1.5 hover:border-[#00e5ff60] hover:text-[#00e5ff] transition-colors cursor-pointer">
            EXPORT PDF
          </button>
          <button className="font-share-tech text-[8px] text-[#606060] border border-[#303030] px-2.5 py-1.5 hover:border-[#00e5ff60] hover:text-[#00e5ff] transition-colors cursor-pointer">
            PRINT
          </button>
        </div>

        <div className="w-px h-9 bg-[#00e5ff30]" />

        {/* Alert bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertPop(!showAlertPop)}
            className="relative flex items-center justify-center w-8 h-8 border border-[#ff3b3b40] hover:border-[#ff3b3b] transition-colors cursor-pointer animate-alert-pulse"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5C5 1.5 3.5 3 3.5 5v3L2 9.5h10L10.5 8V5C10.5 3 9 1.5 7 1.5Z" stroke="#ff3b3b" strokeWidth="0.9" />
              <path d="M5.5 9.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="#ff3b3b" strokeWidth="0.9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#ff3b3b] font-share-tech text-[7px] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {ALERT_COUNT}
            </span>
          </button>

          {showAlertPop && (
            <div className="absolute right-0 top-10 z-50 w-[220px] bg-[#0a0a0a] border border-[#ff3b3b40] shadow-[0_0_20px_#ff3b3b20] animate-fade-in">
              <div className="font-share-tech text-[7px] text-[#ff3b3b] tracking-[2px] px-3 py-2 border-b border-[#ff3b3b20]">
                ACTIVE ALERTS
              </div>
              {[
                "A-01 · HbA1c 8.6% — critical threshold",
                "A-02 · Triglycerides 312 mg/dL — high",
                "A-03 · Biological age +7 yrs above chronological",
                "A-04 · GLP1R promoter methylated",
                "A-05 · Fundus review overdue",
              ].map((a, i) => (
                <div
                  key={i}
                  className="font-share-tech text-[8px] px-3 py-2 border-b border-[#ffffff08] last:border-b-0"
                  style={{ color: i < 2 ? "#ff3b3b" : "#ffaa00" }}
                >
                  {a}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-9 bg-[#00e5ff30]" />

        {/* Status + time */}
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-1.5">
            <span className="w-[7px] h-[7px] rounded-full bg-[#00e676] animate-blink" />
            <span className="font-share-tech text-[9px] text-[#00e676] tracking-[1px]">SIM ACTIVE</span>
          </div>
          <div className="font-share-tech text-[11px] text-[#b0b0b0]">{time}</div>
          <div className="font-share-tech text-[8px] text-[#606060]">DR. PRIYA NAIR · ENDOCRINOLOGY</div>
        </div>
      </div>
    </div>
  );
}
