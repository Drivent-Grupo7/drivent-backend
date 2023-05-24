import { Stripe } from 'stripe';
import ticketService from '../tickets-service';
import { notFoundError, unauthorizedError } from '@/errors';
import { CardPaymentParams, PaymentParams } from '@/protocols';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function verifyTicketAndEnrollment(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.findTickeyById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);
  if (!enrollment) throw notFoundError();

  if (enrollment.userId !== userId) throw unauthorizedError();
}

async function getPaymentByTicketId(userId: number, ticketId: number) {
  await verifyTicketAndEnrollment(ticketId, userId);

  const payment = await paymentsRepository.findPaymentByTicketId(ticketId);
  if (!payment) throw notFoundError();

  return payment;
}

async function paymentProcess(ticketId: number, userId: number, cardData: CardPaymentParams) {
  await verifyTicketAndEnrollment(ticketId, userId);

  const ticket = await ticketsRepository.findTickeWithTypeById(ticketId);

  const paymentData: PaymentParams = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentsRepository.createPayment(ticketId, paymentData);

  await ticketsRepository.ticketProcessPayment(ticketId);

  return payment;
}

async function paymentStripe(userId: number) {
  try {
    const ticket = await ticketService.getTicketByUserId(userId);
    if (!ticket) throw notFoundError();

    await verifyTicketAndEnrollment(ticket.id, userId);

    //const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

    //const customer = await stripe.customers.create({})
    //const session = await stripe.checkout.sessions.create({})
  } catch (error) {
    console.log(error);
  }
}

export default { getPaymentByTicketId, paymentProcess, verifyTicketAndEnrollment, paymentStripe };
