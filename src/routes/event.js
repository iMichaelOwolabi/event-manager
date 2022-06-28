import { Router } from 'express';
import { createEvent, getAllEvents, getEventById } from '../controllers/event.js';
import { authGuard } from '../middleware/index.js';

const eventRouter = Router();

eventRouter.post('', authGuard, createEvent);
eventRouter.get('', getAllEvents);
eventRouter.get('/:eventId', getEventById);

export { eventRouter }
