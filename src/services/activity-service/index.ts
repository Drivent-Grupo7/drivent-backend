import { conflictError, notFoundError } from '@/errors';
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

async function getAuditoriums() {
  const auditoriums = await activityRepository.findAuditoriums();
  if (!auditoriums.length) throw notFoundError();

  return auditoriums;
}
async function getDates(userId: number) {
  await checkEnrollmentTicket(userId);

  const dates = await activityRepository.findDates();
  if (!dates.length) throw notFoundError();

  return dates;
}

async function getActivityByDate(dateActivityId: number) {
  const activities = await activityRepository.findActivityByDate(dateActivityId);
  if (!activities.length) throw notFoundError();

  return activities;
}

async function subscribingActivity(userId: number, activityId: number) {
  if (!activityId) throw badRequestError();

  await checkEnrollmentTicket(userId);

  const subscribes = await activityRepository.findSubscribesByUserId(userId);

  const activity = await activityRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  for (const subscribe of subscribes) {
    const activitySubscribed = subscribe.Activity;
    if (
      (activitySubscribed.startsAt.toString() === activity.startsAt.toString() ||
        activitySubscribed.endsAt.toString() === activity.endsAt.toString()) &&
      activitySubscribed.dateActivityId === activity.dateActivityId
    ) {
      throw conflictError('Activity conflicting day and time!');
    }
  }

  await activityRepository.createSubscriber(userId, activityId);
}

async function deleteSubscribeActivity(userId: number, activityId: number) {
  if (!activityId) throw badRequestError();

  const subscribe = await activityRepository.findSubscribe(userId, activityId);
  if (!subscribe.length) throw notFoundError();

  await activityRepository.deleteSubscriber(userId, activityId);
}

const activityService = {
  getDates,
  getActivityByDate,
  subscribingActivity,
  getAuditoriums,
  deleteSubscribeActivity,
};

export default activityService;
