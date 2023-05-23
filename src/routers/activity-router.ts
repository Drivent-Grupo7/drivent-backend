import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { listDates, listActivityByDate, subscribingActivity } from '@/controllers';
import { activitySchema } from '@/schemas/activity-schemas';

const activityRouter = Router();

activityRouter
  .all('/*', authenticateToken)
  .get('/dates', listDates)
  .get('/:dateActivityId', listActivityByDate)
  .post('', validateBody(activitySchema), subscribingActivity);

export { activityRouter };
