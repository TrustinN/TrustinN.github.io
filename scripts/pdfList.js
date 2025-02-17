import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __filename and __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let dirs = __dirname.split("/");
dirs = dirs.slice(0, dirs.length - 1);
const sourceDir = dirs.join("/");
const pdfBaseDir = "/education/";
const pdfDirectory = path.join(sourceDir, "public", pdfBaseDir);
const outputJson = path.join(sourceDir, "public", pdfBaseDir, "pdfList.json");

/**
 * Recursively collects all PDF files in a directory and subdirectories.
 * @param {string} dirPath - The directory to start the search from.
 * @returns {Object[]} - Array of objects with the PDF file name and its URL.
 */
function getPdfFilesRecursive(dirPath) {
  let pdfList = [];

  // Get all items in the directory (files and subdirectories)
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // If it's a directory, recurse into it
      pdfList = [...pdfList, ...getPdfFilesRecursive(filePath)];
    } else if (file.endsWith(".pdf")) {
      // If it's a PDF file, add it to the list with correct URL
      const relativePath = path.relative(pdfDirectory, filePath); // Get relative path from base directory
      const url = `${pdfBaseDir}${relativePath.replace(/\\/g, "/")}`; // Format the URL correctly

      pdfList.push({
        name: file.replace(".pdf", ""), // Remove extension for a clean name
        url: url, // Correct URL with folder structure
      });
    }
  });

  return pdfList;
}

/**
 * Generate the PDF list JSON file.
 */
function generatePdfList() {
  const pdfList = getPdfFilesRecursive(pdfDirectory);

  // Write the list to a JSON file
  fs.writeFileSync(outputJson, JSON.stringify(pdfList, null, 2));
  console.log(`PDF list written to ${outputJson}`);
}

generatePdfList();
