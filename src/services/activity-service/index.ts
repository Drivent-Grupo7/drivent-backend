import { notFoundError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';
import { cannotBookingError } from '@/errors/cannot-booking-error';
import { cannotListActivityError } from '@/errors/cannot-list-activity-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import activityRepository from '@/repositories/activity-repository';

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotListActivityError('You need to be enrolment!');

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED') {
    throw cannotListActivityError('You need to complete the payment!');
  }

  if (!ticket || ticket.TicketType.isRemote) {
    throw cannotListActivityError('You do not have to choose activities!');
  }
}

async function getDates(userId: number) {
  await checkEnrollmentTicket(userId);

  const dates = await activityRepository.findDates();
  if (!dates) throw notFoundError();

  return dates;
}

async function getActivityByDate(dateActivityId: number) {
  const activities = await activityRepository.findActivityByDate(dateActivityId);
  if (!activities) throw notFoundError();

  return activities;
}

async function subscribingActivity(userId: number, activityId: number) {
  if (!activityId) throw badRequestError();

  await checkEnrollmentTicket(userId);

  const activity = await activityRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  await activityRepository.createSubscriber(userId, activityId);
}

const activityService = {
  getDates,
  getActivityByDate,
  subscribingActivity,
};

export default activityService;
