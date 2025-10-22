import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join, relative, sep, basename } from "path";

const rootDir = ".";                // starting directory
const outputFile = "Combined.md";   // output file
const targetFilename = "Main.md";   // target file name

function getMarkdownHeader(level: number, name: string): string {
  return `${"#".repeat(Math.max(level, 1))} ${name}\n\n`;
}

function collectMainFiles(dir: string, results: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue; // skip hidden files/folders

    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectMainFiles(fullPath, results);
    } else if (entry.isFile() && entry.name === targetFilename) {
      results.push(fullPath);
    }
  }

  return results;
}

function main() {
  const files = collectMainFiles(rootDir);
  let output = "";

  for (const filePath of files) {
    const relPath = relative(rootDir, filePath);
    const folderPath = relPath.split(sep).slice(0, -1).join(sep);
    const depth = folderPath ? folderPath.split(sep).length : 0;
    const folderName = basename(folderPath || rootDir);

    output += getMarkdownHeader(depth + 1, folderName);
    const content = readFileSync(filePath, "utf-8").trim();
    output += content + "\n\n---\n\n";
  }

  writeFileSync(outputFile, output, "utf-8");
  console.log(`✅ Combined Markdown created: ${outputFile}`);
}

main();
