import { prisma, client } from '@/config';

async function findFirst() {
  const eventCached = await client.get('event');
  if (eventCached) {
    return JSON.parse(eventCached);
  }
  const event = await prisma.event.findFirst();
  client.set('event', JSON.stringify(event));
  return event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
