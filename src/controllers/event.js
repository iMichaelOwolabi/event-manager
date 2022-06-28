import { eventRepository } from '../repository/event.js';

const createEvent = async (req, res) => {
  try {
    const { title, description, category, location, locationPoint, startDate, endDate, imageUrl } = req.body;
    const event = await eventRepository.createAndSave({
      title,
      description,
      category,
      location,
      locationPoint,
      startDate,
      endDate,
      imageUrl,
      userId: req.validatedToken.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (event) {
      return res.status(201).send({
        error: false,
        message: 'Event successfully created',
        data: event,
      })
    }
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: `Server error, please try again later. ${error}`
    });
  }
};

export { createEvent };
