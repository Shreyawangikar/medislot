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
            console.log(`📊 Parsed ${rawRows.length} rows from CSV file (${filePath}). Processing coordinates & records...`);

            // Helper for flexible column name matching
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
              const name = getVal(row, 'hospital_name', 'name', 'hospitalname', 'facility_name');
              const address = getVal(row, 'address_original_first_line', 'address', 'location', 'hospital_address');
              const city = getVal(row, 'district', 'city', 'town', 'subdistrict');
              const state = getVal(row, 'state', 'state_name');
              const pincode = getVal(row, 'pincode', 'pin_code', 'postal_code');
              const coordsPair = getVal(row, 'location_coordinates', 'coordinates', 'lat_lng');
              let latStr = getVal(row, 'latitude', 'lat');
              let lngStr = getVal(row, 'longitude', 'lng', 'long');
              const phone = getVal(row, 'mobile_number', 'telephone', 'phone', 'emergency_num', 'contact');
              const email = getVal(row, 'hospital_primary_email_id', 'email', 'contact_email');
              const sourceIdStr = getVal(row, 'sr_no', 'source_id', 'hospital_regis_number', 'id');
              const specStr = getVal(row, 'specialties', 'specializations', 'specialization', 'facilities');

              // Handle Location_Coordinates format "11.6357989, 92.7120575"
              if (coordsPair && coordsPair.includes(',')) {
                const parts = coordsPair.split(',');
                if (parts.length >= 2) {
                  latStr = parts[0].trim();
                  lngStr = parts[1].trim();
                }
              }

              if (!name || (!latStr && !coordsPair)) continue;

              const lat = parseFloat(latStr || '0');
              const lng = parseFloat(lngStr || '0');
              if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) continue;

              const sourceId = sourceIdStr ? `GOV-${sourceIdStr}` : `EXT-${i}-${Date.now()}`;
              if (seenSourceIds.has(sourceId)) continue;
              seenSourceIds.add(sourceId);

              const specs = specStr
                ? specStr.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
                : ['General Medicine', 'Emergency Services'];

              recordsToInsert.push({
                name,
                address: address || 'General Area',
                city: city || 'Unknown City',
                state: state || 'India',
                pincode: pincode && pincode !== '0' ? pincode : '400001',
                latitude: lat,
                longitude: lng,
                phone: phone && phone !== '0' ? phone : '+91 22 26000000',
                email: email && email !== '0' ? email : null,
                specializations: specs.slice(0, 10),
                source: 'Government Hospital Directory',
                source_id: sourceId,
              });
            }

            console.log(`✅ Validated ${recordsToInsert.length} location-aware hospital records with lat/lng coordinates.`);

            if (recordsToInsert.length === 0) {
              return resolve({ importedCount: 0, updatedCount: 0 });
            }

            // Perform high-performance batch insertion into Supabase PostgreSQL
            const BATCH_SIZE = 500;
            let importedCount = 0;

            for (let i = 0; i < recordsToInsert.length; i += BATCH_SIZE) {
              const batch = recordsToInsert.slice(i, i + BATCH_SIZE);
              
              const batchResult = await prisma.externalHospital.createMany({
                data: batch,
                skipDuplicates: true,
              });

              importedCount += batchResult.count;
              if ((i / BATCH_SIZE) % 5 === 0 || i + BATCH_SIZE >= recordsToInsert.length) {
                console.log(`   └─ Imported batch ${Math.floor(i / BATCH_SIZE) + 1} (${importedCount} / ${recordsToInsert.length} records in database).`);
              }
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
