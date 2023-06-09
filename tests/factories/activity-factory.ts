import faker from '@faker-js/faker';
import { TicketType, Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export function createActivity(dateActivityId: number, auditoriumId: number) {
  return prisma.activity.create({
    data: {
      title: faker.name.jobTitle(),
      capacity: faker.datatype.number({ min: 10, max: 100 }),
      dateActivityId,
      startsAt: new Date(),
      endsAt: new Date(),
      auditoriumId,
    },
  });
}

export function createDateActivity() {
  return prisma.dateActivity.create({
    data: {
      title: faker.date.weekday(),
      date: faker.date.soon(1),
    },
  });
}

export function createAuditorium() {
  return prisma.auditorium.create({
    data: {
      name: faker.random.word(),
    },
  });
}

export function createSubscriber(userId: number, activityId: number) {
  return prisma.subscriber.create({
    data: {
      userId,
      activityId,
    },
  });
}

export function ticketReturn(status: TicketStatus, isRemote: boolean) {
  const expected: Ticket & { TicketType: TicketType } = {
    id: 1,
    ticketTypeId: 2,
    enrollmentId: 1,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: 2,
      name: 'Presencial + Com Hotel',
      price: 600,
      isRemote,
      includesHotel: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  return expected;
}
