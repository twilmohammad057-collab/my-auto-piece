import { readFileSync, writeFileSync } from "fs";

const file = "c:/Users/MOHAMMAD/my auto p/src/App.jsx";
const lines = readFileSync(file, "utf8").split("\n");

// Find the placeholder div by a unique string that won't have encoding issues
const start = lines.findIndex(l => l.includes("product-container"));
if (start < 0) { console.log("Not found"); process.exit(1); }

// Find the closing </div> of the placeholder (next </div> after start)
let end = start;
for (let i = start + 1; i < start + 15; i++) {
  if (lines[i]?.includes("</div>") && !lines[i]?.includes("<div")) {
    end = i;
    break;
  }
}

console.log("Replacing lines", start + 1, "to", end + 1);
console.log("Was:", lines[start].trim().substring(0, 80));

// Replace the whole block with a single ProductGrid line
lines.splice(start, end - start + 1, "        <ProductGrid />");

writeFileSync(file, lines.join("\n"), "utf8");
console.log("Done. Total lines:", lines.length);
