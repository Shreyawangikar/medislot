import fs from 'fs';
import csvParser from 'csv-parser';
import { prisma } from '../config/prisma';

export interface CsvHospitalRow {
  [key: string]: string | undefined;
}

export class CsvPipelineService {
  static async processAndImportCsv(filePath: string): Promise<{ importedCount: number; updatedCount: number }> {
    return new Promise((resolve, reject) => {
      const rawRows: CsvHospitalRow[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => rawRows.push(data))
        .on('end', async () => {
          try {
            console.log(`📊 Parsed ${rawRows.length} rows from CSV file. Preparing bulk database import...`);

            // Helper for flexible column matching
            const getVal = (row: CsvHospitalRow, ...keys: string[]) => {
              for (const key of Object.keys(row)) {
                const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                for (const targetKey of keys) {
                  if (normalized === targetKey.toLowerCase().replace(/[^a-z0-9]/g, '')) {
                    return row[key]?.trim();
                  }
                }
              }
              return undefined;
            };

            const recordsToInsert: any[] = [];
            const seenSourceIds = new Set<string>();

            for (let i = 0; i < rawRows.length; i++) {
              const row = rawRows[i];
              const name = getVal(row, 'name', 'hospital_name', 'hospitalname', 'facility_name');
              const address = getVal(row, 'address', 'hospital_address', 'location');
              const city = getVal(row, 'city', 'district', 'town');
              const state = getVal(row, 'state', 'state_name');
              const pincode = getVal(row, 'pincode', 'pin_code', 'postal_code', 'zip');
              const latStr = getVal(row, 'latitude', 'lat', 'y');
              const lngStr = getVal(row, 'longitude', 'lng', 'long', 'x');
              const phone = getVal(row, 'phone', 'phone_number', 'contact', 'mobile');
              const email = getVal(row, 'email', 'email_id', 'contact_email');
              const sourceIdStr = getVal(row, 'source_id', 'sourceid', 'id', 'hospital_id');
              const specStr = getVal(row, 'specializations', 'specialization', 'specialities', 'services');

              if (!name || !city) continue;

              const sourceId = sourceIdStr || `EXT-${Date.now()}-${i}`;
              if (seenSourceIds.has(sourceId)) continue;
              seenSourceIds.add(sourceId);

              const lat = parseFloat(latStr || '18.5204');
              const lng = parseFloat(lngStr || '73.8567');
              const specs = specStr
                ? specStr.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
                : ['General Medicine', 'Emergency Services'];

              recordsToInsert.push({
                name,
                address: address || 'General Area',
                city,
                state: state || 'Maharashtra',
                pincode: pincode || '411001',
                latitude: isNaN(lat) ? 18.5204 : lat,
                longitude: isNaN(lng) ? 73.8567 : lng,
                phone: phone || '+91 020 26120000',
                email: email || null,
                specializations: specs,
                source: 'Government Hospital Directory',
                source_id: sourceId,
              });
            }

            if (recordsToInsert.length === 0) {
              return resolve({ importedCount: 0, updatedCount: 0 });
            }

            // Perform high-performance batch creation (100 rows per batch) to prevent Supabase connection timeouts
            const BATCH_SIZE = 100;
            let importedCount = 0;

            for (let i = 0; i < recordsToInsert.length; i += BATCH_SIZE) {
              const batch = recordsToInsert.slice(i, i + BATCH_SIZE);
              
              // Skip duplicate source_id entries in Supabase
              const batchResult = await prisma.externalHospital.createMany({
                data: batch,
                skipDuplicates: true,
              });

              importedCount += batchResult.count;
              console.log(`   └─ Batch ${Math.floor(i / BATCH_SIZE) + 1} processed (${batchResult.count} records inserted).`);
            }

            resolve({ importedCount, updatedCount: 0 });
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (err) => reject(err));
    });
  }
}
