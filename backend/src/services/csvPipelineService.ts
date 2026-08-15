import fs from 'fs';
import csvParser from 'csv-parser';
import { prisma } from '../config/prisma';

export interface CsvHospitalRow {
  source_id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: string;
  longitude?: string;
  phone: string;
  email?: string;
  specializations?: string;
}

export class CsvPipelineService {
  static async processAndImportCsv(filePath: string): Promise<{ importedCount: number; updatedCount: number }> {
    return new Promise((resolve, reject) => {
      const results: CsvHospitalRow[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            let importedCount = 0;
            let updatedCount = 0;

            for (const row of results) {
              if (!row.name || !row.city) continue;

              const cleanName = row.name.trim();
              const cleanAddress = (row.address || 'General Area').trim();
              const cleanCity = row.city.trim();
              const cleanState = (row.state || 'Maharashtra').trim();
              const cleanPincode = (row.pincode || '411001').trim();
              const lat = parseFloat(row.latitude || '18.5204');
              const lng = parseFloat(row.longitude || '73.8567');
              const cleanPhone = (row.phone || '+91 020 26120000').trim();
              const sourceId = row.source_id?.trim() || `EXT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              const specs = row.specializations
                ? row.specializations.split(';').map((s) => s.trim())
                : ['General Medicine', 'Emergency Services'];

              // Duplicate detection via source_id
              const existing = await prisma.externalHospital.findUnique({
                where: { source_id: sourceId },
              });

              if (existing) {
                await prisma.externalHospital.update({
                  where: { id: existing.id },
                  data: {
                    name: cleanName,
                    address: cleanAddress,
                    city: cleanCity,
                    phone: cleanPhone,
                    specializations: specs,
                  },
                });
                updatedCount++;
              } else {
                await prisma.externalHospital.create({
                  data: {
                    name: cleanName,
                    address: cleanAddress,
                    city: cleanCity,
                    state: cleanState,
                    pincode: cleanPincode,
                    latitude: isNaN(lat) ? 18.5204 : lat,
                    longitude: isNaN(lng) ? 73.8567 : lng,
                    phone: cleanPhone,
                    email: row.email?.trim() || null,
                    specializations: specs,
                    source: 'Government Hospital Directory',
                    source_id: sourceId,
                  },
                });
                importedCount++;
              }
            }

            resolve({ importedCount, updatedCount });
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (err) => reject(err));
    });
  }
}
