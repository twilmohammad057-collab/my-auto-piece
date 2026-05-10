import { readFileSync, writeFileSync } from "fs";

const file = "c:/Users/MOHAMMAD/my auto p/src/App.jsx";
let lines = readFileSync(file, "utf8").split("\n");

// ── Find & fix desktop header title ──────────────────────────────────
const deskIdx = lines.findIndex(l => l.includes("clamp(18px") && l.includes("MY AUTO"));
if (deskIdx >= 0) {
  lines[deskIdx] = '                <div style={{fontSize:"clamp(18px,2.2vw,24px)",fontWeight:900,letterSpacing:"2.5px",color:"#FFFFFF",lineHeight:1,whiteSpace:"nowrap"}}>MY AUTO PIÈCES</div>';
  // Remove subtitle if still there
  if (lines[deskIdx+1]?.includes("PIÈCES D'ORIGINE") || lines[deskIdx+1]?.includes("MAROC")) {
    lines.splice(deskIdx+1, 1);
    console.log("Desktop subtitle removed");
  }
  console.log("Desktop title fixed at line", deskIdx+1);
}

// ── Find & fix mobile menu header ────────────────────────────────────
// Look for any line with MY AUTO in the mobile menu area (before line 640)
const mobileIdx = lines.findIndex((l, i) => i < 640 && l.includes("MY AUTO"));
if (mobileIdx >= 0) {
  console.log("Mobile found at line", mobileIdx+1, ":", lines[mobileIdx].trim().substring(0, 80));
  lines[mobileIdx] = '                  <div style={{fontSize:17,fontWeight:900,letterSpacing:"2px",color:"#FFFFFF"}}>MY AUTO PIÈCES</div>';
  if (lines[mobileIdx+1]?.includes("PIÈCES") || lines[mobileIdx+1]?.includes("ORIGINE")) {
    lines.splice(mobileIdx+1, 1);
    console.log("Mobile subtitle removed");
  }
  console.log("Mobile title fixed");
} else {
  // Broaden search — look in first 650 lines
  for (let i = 0; i < 650; i++) {
    if (lines[i]?.includes("MY AUTO")) {
      console.log("Found MY AUTO at line", i+1, ":", lines[i].trim().substring(0,100));
    }
  }
}

writeFileSync(file, lines.join("\n"), "utf8");
console.log("Done. Total lines:", lines.length);
