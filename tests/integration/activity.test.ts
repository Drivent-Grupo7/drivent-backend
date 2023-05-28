import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createActivity,
  createAuditorium,
  createDateActivity,
  createEnrollmentWithAddress,
  createPayment,
  createTicket,
  createTicketTypeRemote,
  createTicketTypeWithHotel,
  createUser,
  createTicketType,
  createHotel,
  createRoomWithHotelId,
  createBooking,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { client } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

// describe('GET /activity/auditorium', () => {
//     it('should respond with status 401 if no token is given', async () => {
//         const response = await server.get('/activity/auditorium');

//         expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//       });

//       it('should respond with status 401 if given token is not valid', async () => {
//         const token = faker.lorem.word();

//         const response = await server.get('/activity/auditorium').set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//       });

//       it('should respond with status 401 if there is no session for given token', async () => {
//         const userWithoutSession = await createUser();
//         const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//         const response = await server.get('/activity/auditorium').set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//       });

//       describe("when token is valid", () => {

//         // it('should respond with status 400 if query param ticketId is missing', async () => {
//         //   const token = await generateValidToken();

//         //   const response = await server.get('/activity/auditorium').set('Authorization', `Bearer ${token}`);

//         //   expect(response.status).toEqual(httpStatus.BAD_REQUEST);
//         // });

//         // it('should respond with status 404 when given ticket doesnt exist', async () => {
//         //   const user = await createUser();
//         //   const token = await generateValidToken(user);
//         //   await createEnrollmentWithAddress(user);

//         //   const response = await server.get('/activity/auditorium').set('Authorization', `Bearer ${token}`);

//         //   expect(response.status).toEqual(httpStatus.NOT_FOUND);
//         // });

//         // it('should respond with status 401 when user doesnt own given ticket', async () => {
//         //   const user = await createUser();
//         //   const token = await generateValidToken(user);
//         //   await createEnrollmentWithAddress(user);
//         //   const ticketType = await createTicketType();

//         //   const otherUser = await createUser();
//         //   const otherUserEnrollment = await createEnrollmentWithAddress(otherUser);
//         //   const ticket = await createTicket(otherUserEnrollment.id, ticketType.id, TicketStatus.RESERVED);

//         //   const response = await server.get(`/activity/auditorium`).set('Authorization', `Bearer ${token}`);

//         //   expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
//         // });

//         it("should respond with status 404 when auditorium doesn't exists", async () => {
//           const user = await createUser();
//           const token = await generateValidToken(user);

//           const response = await server.get('/activity/auditorium').set('Authorization', `Bearer ${token}`);

//           expect(response.status).toEqual(httpStatus.NOT_FOUND);

//         })

//         it("should respond with status 200 when has an auditorium", async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createTicketTypeWithHotel();
//             const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             await createPayment(ticket.id, ticketType.price);
//             const auditorium = await createAuditorium();

//             const response = await server.get("/activity/auditorium").set("Authorization", `Bearer ${token}`);

//             expect(response.status).toEqual(httpStatus.OK);

//             expect(response.body).toEqual([{
//               id: auditorium.id,
//               name: auditorium.name,
//               createdAt: auditorium.createdAt.toISOString(),
//               updatedAt: null
//             }]);
//     })
// })

//     //   it('should respond with status 404 if there is no event', async () => {
//     //     await client.del('event');
//     //     const response = await server.get('/activity/auditorium');

//     //     expect(response.status).toBe(httpStatus.NOT_FOUND);
//     //   });

//     // it('should respond with status 404 if there is no auditorium', async () => {
//     //     const event = await fact.createEvent();
//     //     const response = await server.get(`/activity/auditorium?eventId=${event.id}`);

//     // })

//     //   olhar função do service de activity, tem comentários da laura. Tem que colocar o if para caso seja pago e para caso seja online
//     //  se for online ele não precisa se cadastrar em atividade nenhuma, porque já é automático. 403 pagante e online, você não tem que
//     // escolher atividades.

// })

function createValidBody() {
  return {
    roomId: 1,
  };
}

describe('GET /actitity/:dateActivityId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activity/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activity/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activity/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 with a valid body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({
        roomId: room.id,
        userId: user.id,
      });
      const date = await createDateActivity();

      const auditorium = await createAuditorium();

      console.log('Chegando se ta criando o auditório', auditorium);

      const activity = await createActivity(auditorium.id, date.id);

      console.log('Checando se ta criando a atividade', activity);

      const response = await server.get(`/activity/${date.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual({
        id: activity.id,
        title: activity.title,
        capacity: activity.capacity,
        dateActivityId: activity.dateActivityId,
        startsAt: activity.startsAt.toDateString(),
        endsAt: activity.endsAt.toDateString(),
        auditoriumId: activity.auditoriumId,
        createdAt: activity.createdAt.toISOString(),
        updatedAt: activity.updatedAt.toISOString(),
      });
    });

    // it('should respond with status 400 with invalid bookingId', async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createTicketTypeWithHotel();
    //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    //   const payment = await createPayment(ticket.id, ticketType.price);

    //   const hotel = await createHotel();
    //   const room = await createRoomWithHotelId(hotel.id);
    //   const booking = await createBooking({
    //     roomId: room.id,
    //     userId: user.id,
    //   });

    //   const otherRoom = await createRoomWithHotelId(hotel.id);

    //   const response = await server.put('/booking/0').set('Authorization', `Bearer ${token}`).send({
    //     roomId: otherRoom.id,
    //   });

    //   expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    // });
    // it('should respond with status 400 with a invalid body', async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createTicketTypeWithHotel();
    //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    //   const payment = await createPayment(ticket.id, ticketType.price);

    //   const hotel = await createHotel();
    //   const room = await createRoomWithHotelId(hotel.id);

    //   const booking = await createBooking({
    //     roomId: room.id,
    //     userId: user.id,
    //   });

    //   const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
    //     roomId: 0,
    //   });

    //   expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    // });
    // it("should respond with status 404 with a invalid body - there's no roomId", async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createTicketTypeWithHotel();
    //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    //   const payment = await createPayment(ticket.id, ticketType.price);

    //   const hotel = await createHotel();
    //   const room = await createRoomWithHotelId(hotel.id);

    //   const booking = await createBooking({
    //     roomId: room.id,
    //     userId: user.id,
    //   });
    //   const validBody = createValidBody();
    //   const response = await server
    //     .put(`/booking/${booking.id}`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send({
    //       roomId: room.id + 1,
    //     });

    //   expect(response.status).toEqual(httpStatus.NOT_FOUND);
    // });
    // it("should respond with status 403 with a invalid body - there's not vacancy", async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createTicketTypeWithHotel();
    //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    //   const payment = await createPayment(ticket.id, ticketType.price);

    //   const hotel = await createHotel();
    //   const room = await createRoomWithHotelId(hotel.id);

    //   const otherRoom = await createRoomWithHotelId(hotel.id);
    //   const booking = await createBooking({
    //     userId: user.id,
    //     roomId: otherRoom.id,
    //   });
    //   await createBooking({
    //     userId: user.id,
    //     roomId: otherRoom.id,
    //   });
    //   await createBooking({
    //     userId: user.id,
    //     roomId: otherRoom.id,
    //   });

    //   const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
    //     roomId: otherRoom.id,
    //   });

    //   expect(response.status).toEqual(httpStatus.FORBIDDEN);
    // });

    // it('should respond with status 404 when user has not a booking ', async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createTicketTypeWithHotel();
    //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    //   const payment = await createPayment(ticket.id, ticketType.price);

    //   const hotel = await createHotel();
    //   const room = await createRoomWithHotelId(hotel.id);

    //   const otherUser = await createUser();
    //   const otherUserBooking = await createBooking({
    //     userId: otherUser.id,
    //     roomId: room.id,
    //   });

    //   const validBody = createValidBody();
    //   const response = await server
    //     .put(`/booking/${otherUserBooking.id}`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send({
    //       roomId: room.id,
    //     });

    //   expect(response.status).toEqual(httpStatus.FORBIDDEN);
    // });
  });
});
