import { Router } from 'express';
import { SpatialController } from '../controllers/spatialController';

const router = Router();

router.get('/nearby', SpatialController.searchNearby);

export default router;
