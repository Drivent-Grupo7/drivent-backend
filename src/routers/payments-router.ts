import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getPaymentByTicketId, paymentProcess } from '@/controllers';
import { paymentDataSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentByTicketId)
  .post('/process', validateBody(paymentDataSchema), paymentProcess);

export { paymentsRouter };
