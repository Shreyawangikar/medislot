export type Role = 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN' | 'PLATFORM_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  patientProfile?: {
    id: string;
    phone?: string;
    dateOfBirth?: string;
  };
  doctorProfile?: {
    id: string;
    hospitalId: string;
    departmentId: string;
    specialization: string;
  };
  hospitalAdminProfile?: {
    id: string;
    hospitalId: string;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password_hash?: string;
  password?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  date_of_birth?: string;
}
