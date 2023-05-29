import { enrollmentWithAddressReturn, ticketReturn } from '../factories';
import activityService from '../../src/services/activity-service';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotListActivityError } from '@/errors/cannot-list-activity-error';

describe('checkEnrollmentTicket function', () => {
  it('should return error in find enrollment', async () => {
    const userId = 1;

    jest.spyOn(activityService, 'checkEnrollmentTicket').mockResolvedValue(undefined);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(null);

    await expect(activityService.getDates(userId)).rejects.toEqual(
      cannotListActivityError('You need to be enrolment!'),
    );
    expect(enrollmentRepository.findWithAddressByUserId).toHaveBeenCalledWith(userId);
  });

  it('should return error in find ticket not paid', async () => {
    const userId = 1;

    jest.spyOn(activityService, 'checkEnrollmentTicket').mockResolvedValue(undefined);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(ticketReturn('RESERVED', false));

    await expect(activityService.getDates(userId)).rejects.toEqual(
      cannotListActivityError('You need to complete the payment!'),
    );
    expect(ticketsRepository.findTicketByEnrollmentId).toHaveBeenCalledWith(userId);
  });

  it('should return error in find ticket is remote', async () => {
    const userId = 1;

    jest.spyOn(activityService, 'checkEnrollmentTicket').mockResolvedValue(undefined);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(ticketReturn('PAID', true));

    await expect(activityService.getDates(userId)).rejects.toEqual(
      cannotListActivityError('You do not have to choose activities!'),
    );
    expect(ticketsRepository.findTicketByEnrollmentId).toHaveBeenCalledWith(userId);
  });
});
