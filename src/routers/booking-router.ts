import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookingRoom, changeBooking, listBooking, listBookingByHotel } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('', listBooking)
  .get('/:hotelId', listBookingByHotel)
  .post('', bookingRoom)
  .put('/:bookingId', changeBooking);

export { bookingRouter };
