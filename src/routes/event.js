import { Router } from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  getEventsByUserId,
  getEventsNearMe,
} from '../controllers/event.js';
import { authGuard } from '../middleware/index.js';

const eventRouter = Router();

eventRouter.post('', authGuard, createEvent);
eventRouter.get('', getAllEvents);
eventRouter.get('/users', authGuard, getEventsByUserId);
eventRouter.get('/locations', getEventsNearMe);
eventRouter.get('/:eventId', getEventById);

export { eventRouter };
