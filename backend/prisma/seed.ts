import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MediSlot Phase 3 Database...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Hospital
  const hospital = await prisma.hospital.upsert({
    where: { id: 'seed-hosp-1' },
    update: {},
    create: {
      id: 'seed-hosp-1',
      name: 'Kothrud Super Specialty Hospital',
      address: 'Karve Road, Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      phone: '+91 (020) 2544-8900',
      email: 'contact@kothrudhospital.org',
      description: 'Premier multi-specialty tertiary care hospital in Kothrud.',
    },
  });

  // 2. Create Department
  const department = await prisma.department.upsert({
    where: { id: 'seed-dept-1' },
    update: {},
    create: {
      id: 'seed-dept-1',
      hospital_id: hospital.id,
      name: 'Cardiology',
      description: 'Comprehensive heart and vascular care.',
    },
  });

  // 3. Create Patient User & Profile
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@medislot.org' },
    update: {},
    create: {
      name: 'Ananya Sharma',
      email: 'patient@medislot.org',
      password_hash: passwordHash,
      role: Role.PATIENT,
      patient: {
        create: {
          phone: '+91 9876543210',
          date_of_birth: '1995-05-15',
        },
      },
    },
  });

  // 4. Create Doctor User & Profile
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@medislot.org' },
    update: {},
    create: {
      name: 'Dr. Rahul Deshmukh',
      email: 'doctor@medislot.org',
      password_hash: passwordHash,
      role: Role.DOCTOR,
      doctor: {
        create: {
          hospital_id: hospital.id,
          department_id: department.id,
          specialization: 'Cardiology',
          qualification: 'MD, DM (Cardiology)',
          is_active: true,
        },
      },
    },
  });

  // 5. Create Hospital Admin User & Profile
  const hospAdminUser = await prisma.user.upsert({
    where: { email: 'hospitaladmin@medislot.org' },
    update: {},
    create: {
      name: 'Vikram Mehta',
      email: 'hospitaladmin@medislot.org',
      password_hash: passwordHash,
      role: Role.HOSPITAL_ADMIN,
      hospitalAdmin: {
        create: {
          hospital_id: hospital.id,
        },
      },
    },
  });

  // 6. Create Platform Admin User
  const platformAdminUser = await prisma.user.upsert({
    where: { email: 'platformadmin@medislot.org' },
    update: {},
    create: {
      name: 'MediSlot Platform Administrator',
      email: 'platformadmin@medislot.org',
      password_hash: passwordHash,
      role: Role.PLATFORM_ADMIN,
    },
  });

  console.log('Database seeded successfully:');
  console.log(`- Patient: patient@medislot.org (Password123!)`);
  console.log(`- Doctor: doctor@medislot.org (Password123!)`);
  console.log(`- Hospital Admin: hospitaladmin@medislot.org (Password123!)`);
  console.log(`- Platform Admin: platformadmin@medislot.org (Password123!)`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
