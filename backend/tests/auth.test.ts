import request from 'supertest';
import app from '../src/app';
import { signToken } from '../src/utils/jwt';

describe('Phase 3 Auth & Role-Based Access Control (RBAC) API Suite', () => {

  const mockPatientUser = {
    name: 'Test Patient User',
    email: `testpatient_${Date.now()}@medislot.org`,
    password: 'SecurePassword123!',
    phone: '+91 9988776655',
  };

  let patientToken: string;
  let doctorToken: string;
  let hospitalAdminToken: string;
  let platformAdminToken: string;

  beforeAll(() => {
    // Generate valid tokens for role testing
    patientToken = signToken({ userId: 'test-patient-id', role: 'PATIENT' });
    doctorToken = signToken({ userId: 'test-doctor-id', role: 'DOCTOR' });
    hospitalAdminToken = signToken({ userId: 'test-hosp-admin-id', role: 'HOSPITAL_ADMIN' });
    platformAdminToken = signToken({ userId: 'test-plat-admin-id', role: 'PLATFORM_ADMIN' });
  });

  describe('1. Registration Validation', () => {
    it('should fail registration when missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@medislot.org' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail registration with weak short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Short Pass', email: 'short@medislot.org', password: '123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Password must be at least 6 characters');
    });
  });

  describe('2. Login Validation', () => {
    it('should reject login with missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('3. JWT Authentication Middleware', () => {
    it('should block protected route when authorization token is missing', async () => {
      const res = await request(app).get('/api/protected/profile');
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Authentication required');
    });

    it('should block protected route when token is invalid or malformed', async () => {
      const res = await request(app)
        .get('/api/protected/profile')
        .set('Authorization', 'Bearer invalid_token_xyz_123');
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid or expired authentication token');
    });

    it('should allow access to profile endpoint with valid JWT', async () => {
      const res = await request(app)
        .get('/api/protected/profile')
        .set('Authorization', `Bearer ${patientToken}`);
      expect(res.status).toBe(200);
      expect(res.body.userId).toBe('test-patient-id');
      expect(res.body.role).toBe('PATIENT');
    });
  });

  describe('4. Role-Based Access Control (RBAC) Enforcement', () => {
    it('PATIENT can access PATIENT endpoint (200 OK)', async () => {
      const res = await request(app)
        .get('/api/protected/patient')
        .set('Authorization', `Bearer ${patientToken}`);
      expect(res.status).toBe(200);
      expect(res.body.role).toBe('PATIENT');
    });

    it('PATIENT attempting DOCTOR endpoint is forbidden (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/protected/doctor')
        .set('Authorization', `Bearer ${patientToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toContain("Role 'PATIENT' is not authorized");
    });

    it('PATIENT attempting HOSPITAL_ADMIN endpoint is forbidden (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/protected/hospital-admin')
        .set('Authorization', `Bearer ${patientToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toContain("Role 'PATIENT' is not authorized");
    });

    it('PATIENT attempting PLATFORM_ADMIN endpoint is forbidden (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/protected/platform-admin')
        .set('Authorization', `Bearer ${patientToken}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toContain("Role 'PATIENT' is not authorized");
    });

    it('DOCTOR can access DOCTOR endpoint (200 OK)', async () => {
      const res = await request(app)
        .get('/api/protected/doctor')
        .set('Authorization', `Bearer ${doctorToken}`);
      expect(res.status).toBe(200);
      expect(res.body.role).toBe('DOCTOR');
    });

    it('HOSPITAL_ADMIN can access HOSPITAL_ADMIN endpoint (200 OK)', async () => {
      const res = await request(app)
        .get('/api/protected/hospital-admin')
        .set('Authorization', `Bearer ${hospitalAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.role).toBe('HOSPITAL_ADMIN');
    });

    it('PLATFORM_ADMIN can access PLATFORM_ADMIN endpoint (200 OK)', async () => {
      const res = await request(app)
        .get('/api/protected/platform-admin')
        .set('Authorization', `Bearer ${platformAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.role).toBe('PLATFORM_ADMIN');
    });
  });

});
