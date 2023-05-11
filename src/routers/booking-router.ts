import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingRoom, changeBooking, listBooking, listBookingByHotel } from '@/controllers';
import { bookingSchema } from '@/schemas/booking-schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('', listBooking)
  .get('/:hotelId', listBookingByHotel)
  .post('', validateBody(bookingSchema), bookingRoom)
  .put('/:bookingId', validateBody(bookingSchema), changeBooking);

export { bookingRouter };
