import { Router } from 'express';
import { createEvent } from '../controllers/event.js';
import { authGuard } from '../middleware/index.js';

const eventRouter = Router();

eventRouter.post('', authGuard, createEvent);

export { eventRouter }
