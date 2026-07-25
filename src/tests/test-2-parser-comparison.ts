import fs from "fs/promises";
import { SrtParser, VttParser } from "../parsers";

export async function testParserComparison() {
  console.log("\n========== TEST 2: SRT vs VTT Comparison ==========");
  
  const srt = await fs.readFile(
    "./data/01_what-is-mobile-development_epm.srt",
    "utf8"
  );

  const vtt = await fs.readFile(
    "./data/01_what-is-mobile-development_epm.vtt",
    "utf8"
  );

  const lesson = {
    id: "lesson-001",
    title: "What is Mobile Development",
    order: 1,
    source: "vtt" as const,
  };

  const srtDoc = new SrtParser().parse(srt, {
    lesson: {
      ...lesson,
      source: "srt"
    },
  });

  const vttDoc = new VttParser().parse(vtt, {
    lesson,
  });

  console.log(`✅ SRT segments: ${srtDoc.segments.length}`);
  console.log(`✅ VTT segments: ${vttDoc.segments.length}`);
  console.log("====================================\n");
  
  return { srtDoc, vttDoc };
}