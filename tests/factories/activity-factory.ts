import faker from '@faker-js/faker';
import { Activity } from '@prisma/client';
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
    include: {
      Activity: true,
    },
  });
}

// export function findActivityReturn() {
//   // const expected: Activity = {
//   // id: faker.datatype.number(),
//   // title: faker.datatype.string(),
//   // capacity: faker.datatype.number({min: 10, max: 100}),
//   // dateActivityId: faker.datatype.number(),
//   // startsAt: new Date(),
//   // endsAt: new Date(),
//   // auditoriumId: faker.datatype.number(),
//   // createdAt: new Date(),
//   // updatedAt: new Date(),
//   // };
//   const expected: Activity = {
//     id: 1,
//     title: 'Teste',
//     capacity: 5,
//     dateActivityId: 1,
//     startsAt: new Date(),
//     endsAt: new Date(),
//     auditoriumId: 1,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   return expected;
// }
