import fs from "fs/promises";
import { SrtParser } from "../parsers";

export async function testParser() {
  console.log("\n========== TEST 1: Parser ==========");
  
  const content = await fs.readFile(
    "./data/01_what-is-mobile-development_epm.srt",
    "utf8"
  );

  const parser = new SrtParser();
  const transcript = parser.parse(content, {
    lesson: {
      id: "lesson-001",
      title: "01 What is Mobile Development",
      order: 1,
      source: "srt",
    },
  });

  console.log(`✅ Parsed ${transcript.segments.length} segments`);
  console.log(`   First segment: ${transcript.segments[0]?.text.slice(0, 50)}...`);
  console.log("====================================\n");
  
  return transcript;
}