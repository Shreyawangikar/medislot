import path from 'path';
import fs from 'fs';
import { CsvPipelineService } from '../services/csvPipelineService';

async function runCsvImport() {
  const filePath = process.argv[2] || path.join(__dirname, '../../data/sample_government_hospitals.csv');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ CSV File not found at path: ${filePath}`);
    console.log(`Usage: npx tsx src/scripts/importGovernmentCsv.ts <path-to-csv-file>`);
    process.exit(1);
  }

  console.log(`🔄 Processing and importing Government Directory CSV from: ${filePath}...`);

  try {
    const result = await CsvPipelineService.processAndImportCsv(filePath);
    console.log(`✅ CSV Pipeline Import Completed Successfully!`);
    console.log(`   - New External Hospitals Imported: ${result.importedCount}`);
    console.log(`   - Existing External Hospitals Updated: ${result.updatedCount}`);
  } catch (error) {
    console.error(`❌ Failed to import CSV:`, error);
    process.exit(1);
  }
}

runCsvImport();
