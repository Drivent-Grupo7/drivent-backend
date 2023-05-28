import { Subscriber } from '@prisma/client';
import { prisma } from '@/config';

async function findDates() {
  return prisma.dateActivity.findMany();
}

async function findAuditoriums() {
  return prisma.auditorium.findMany();
}

async function findActivityByDate(dateActivityId: number) {
  return prisma.activity.findMany({
    where: {
      dateActivityId,
    },
    include: {
      Subscriber: {
        select: {
          userId: true,
        },
      },
    },
  });
}

async function findActivityById(id: number) {
  return prisma.activity.findUnique({
    where: {
      id,
    },
  });
}

async function findSubscribesByUserId(userId: number) {
  return prisma.subscriber.findMany({
    where: {
      userId,
    },
    include: {
      Activity: true,
    },
  });
}

async function createSubscriber(userId: number, activityId: number) {
  await prisma.subscriber.create({
    data: {
      userId,
      activityId,
    },
  });
}

async function findSubscribe(userId: number, activityId: number) {
  return prisma.subscriber.findMany({
    where: {
      userId,
      activityId,
    },
  });
}

async function deleteSubscriber(userId: number, activityId: number) {
  await prisma.subscriber.deleteMany({
    where: {
      userId,
      activityId,
    },
  });
}

const activityRepository = {
  findDates,
  findActivityByDate,
  findActivityById,
  createSubscriber,
  findAuditoriums,
  findSubscribesByUserId,
  findSubscribe,
  deleteSubscriber,
};

export default activityRepository;
