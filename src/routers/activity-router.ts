import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { listDates, listActivityByDate, subscribingActivity, listAuditoriums } from '@/controllers';
import { activitySchema } from '@/schemas/activity-schemas';

const activityRouter = Router();

activityRouter
  .all('/*', authenticateToken)
  .get('/auditoriums', listAuditoriums)
  .get('/dates', listDates)
  .get('/:dateActivityId', listActivityByDate)
  .post('', validateBody(activitySchema), subscribingActivity);

export { activityRouter };
