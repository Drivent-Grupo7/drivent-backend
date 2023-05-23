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
  return prisma.activity.findMany({
    where: {
      id,
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

const activityRepository = {
  findDates,
  findActivityByDate,
  findActivityById,
  createSubscriber,
  findAuditoriums,
};

export default activityRepository;
