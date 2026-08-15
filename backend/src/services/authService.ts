import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { signToken } from '../utils/jwt';
import { Role } from '@prisma/client';

export interface RegisterPatientDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  date_of_birth?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  static async registerPatient(dto: RegisterPatientDto) {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw { status: 400, message: 'Email address is already registered.' };
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(dto.password, salt);

    // Create User and associated Patient profile in transaction
    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password_hash,
        role: Role.PATIENT,
        patient: {
          create: {
            phone: dto.phone,
            date_of_birth: dto.date_of_birth,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        patient: {
          select: {
            id: true,
            phone: true,
            date_of_birth: true,
          },
        },
      },
    });

    const token = signToken({ userId: user.id, role: user.role });

    return {
      message: 'Patient registration successful.',
      token,
      user,
    };
  }

  static async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        patient: true,
        doctor: true,
        hospitalAdmin: true,
      },
    });

    if (!user) {
      throw { status: 401, message: 'Invalid email or password.' };
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid email or password.' };
    }

    const token = signToken({ userId: user.id, role: user.role });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      patientProfile: user.patient ? { id: user.patient.id, phone: user.patient.phone } : undefined,
      doctorProfile: user.doctor ? { id: user.doctor.id, specialization: user.doctor.specialization } : undefined,
      hospitalAdminProfile: user.hospitalAdmin ? { id: user.hospitalAdmin.id, hospitalId: user.hospitalAdmin.hospital_id } : undefined,
    };

    return {
      message: 'Authentication successful.',
      token,
      user: safeUser,
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        patient: {
          select: {
            id: true,
            phone: true,
            date_of_birth: true,
          },
        },
        doctor: {
          select: {
            id: true,
            hospital_id: true,
            specialization: true,
            qualification: true,
          },
        },
        hospitalAdmin: {
          select: {
            id: true,
            hospital_id: true,
          },
        },
      },
    });

    if (!user) {
      throw { status: 444, message: 'User record not found.' };
    }

    return user;
  }
}
