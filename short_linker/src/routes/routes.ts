import { Router } from 'express';

import route from '../controllers/controllers';

const router = Router();

router.post('/shortener', route.shortener);
router.get('/:url', route.return);

export default router;
