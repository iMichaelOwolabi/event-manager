import { Router } from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  getEventsByUserId,
} from '../controllers/event.js';
import { authGuard } from '../middleware/index.js';

const eventRouter = Router();

eventRouter.post('', authGuard, createEvent);
eventRouter.get('', getAllEvents);
eventRouter.get('/users', authGuard, getEventsByUserId);
eventRouter.get('/:eventId', getEventById);

export { eventRouter };
