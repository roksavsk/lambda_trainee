import { Router } from 'express';

import find from '../controllers/controllers';

const router = Router();

router.post('/city', find.cityClinics);
router.post('/suburb', find.suburbClinics);
router.post('/state', find.stateClinics);
router.post('/postcode', find.postcodeClinics);
router.post('/few_suburbs', find.fewSuburbs);
router.post('/few_cities', find.fewCities);
router.post('/nearby', find.nearbyClinic);
router.post('/city_info', find.cityInfo);
router.post('/suburb_info', find.suburbInfo);

export default router;
