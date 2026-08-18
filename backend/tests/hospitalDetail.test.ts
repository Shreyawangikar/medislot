import request from 'supertest';
import app from '../src/app';
import { SpatialSearchService } from '../src/services/spatialSearchService';

describe('Hospital detail lookup API', () => {
    it('should return a hospital detail payload for a valid hospital id', async () => {
        const mockHospital = {
            id: 'hospital-123',
            name: 'Pune City Hospital',
            address: 'Near Shivajinagar',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411005',
            phone: '+91 9876543210',
            email: 'care@punecityhospital.in',
            description: 'Advanced multi-specialty care facility.',
            distanceKm: 1.2,
            registered: true,
            bookingAvailable: true,
            specializations: ['Cardiology', 'Neurology'],
            doctors: [{ id: 'doc-1', name: 'Dr. Sharma', specialization: 'Cardiology' }],
            departments: [{ id: 'dep-1', name: 'Cardiology', description: 'Heart care unit', doctorCount: 2 }],
        };

        const spy = jest.spyOn(SpatialSearchService, 'findHospitalById').mockResolvedValue(mockHospital as any);

        const res = await request(app).get('/api/hospitals/hospital-123');

        expect(res.status).toBe(200);
        expect(spy).toHaveBeenCalledWith('hospital-123');
        expect(res.body).toMatchObject({
            id: 'hospital-123',
            name: 'Pune City Hospital',
            registered: true,
        });

        spy.mockRestore();
    });
});
