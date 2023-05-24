import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPaymentByTicketId, paymentProcess, paymentStripe } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentByTicketId)
  .post('/process', paymentProcess)
  .post('create-checkout-session', paymentStripe);

export { paymentsRouter };
