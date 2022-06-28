import { eventRepository } from '../repository/event.js';
import { preparePagination, getTotalPages } from '../utils/pagination.js';

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      locationPoint,
      startDate,
      endDate,
      imageUrl,
    } = req.body;
    const event = await eventRepository.createAndSave({
      title,
      description,
      category,
      venue,
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
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: `Server error, please try again later. ${error}`,
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const { page: offset, limit: count } = preparePagination(page, limit);

    // Fetch all events sorting by the date created which ensures that the latest one come up first
    const allEvents = await eventRepository
      .search()
      .sortDescending('createdAt')
      .return.page(offset, count);

    // Get the total number of events in the DB
    const totalEvents = await eventRepository.search().return.count();

    const totalPages = getTotalPages(totalEvents, count);

    return res.status(200).send({
      error: false,
      message: 'Events retrieved successfylly',
      data: {
        allEvents,
        totalEvents,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: `Server error, please try again later. ${error}`,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch all events sorting by the date created which ensures that the latest one come up first
    const event = await eventRepository.fetch(eventId);

    return res.status(200).send({
      error: false,
      message: 'Event retrieved successfylly',
      data: event,
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: `Server error, please try again later. ${error}`,
    });
  }
};

const getEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.validatedToken;
    const { page, limit } = req.query;

    const { page: offset, limit: count } = preparePagination(page, limit);

    // Fetch all host events sorting by the date created which ensures that the latest one come up first
    const userEvents = await eventRepository
      .search()
      .where('userId')
      .equal(userId)
      .sortDescending('createdAt')
      .return.page(offset, count);

    // Get the total number of events in the DB
    const totalEvents = await eventRepository
      .search()
      .where('userId')
      .equal(userId)
      .return.count();

    const totalPages = getTotalPages(totalEvents, count);

    return res.status(200).send({
      error: false,
      message: 'Events retrieved successfylly',
      data: {
        userEvents,
        totalEvents,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: `Server error, please try again later. ${error}`,
    });
  }
};

const getEventsNearMe = async (req, res) => {
  try {
    const lon = Number(req.query.lon);
    const lat = Number(req.query.lat);
    const distanceInKm = Number(req.query.distanceInKm) ?? 10;

    const { page, limit } = req.query;

    const { page: offset, limit: count } = preparePagination(page, limit);

    // Fetch all events 10 KM radius from the location supplied
    const eventsNearMe = await eventRepository
      .search()
      .where('locationPoint')
      .inRadius(
        (circle) => circle.origin(lon, lat).radius(Number(distanceInKm)).km
      )
      .sortDescending('createdAt')
      .return.page(offset, count);

    // Get the total number of events according to the search queries in the DB
    const totalEvents = await eventRepository
      .search()
      .where('locationPoint')
      .inRadius(
        (circle) => circle.origin(lon, lat).radius(Number(distanceInKm)).km
      )
      .return.count();

    const totalPages = getTotalPages(totalEvents, count);

    return res.status(200).send({
      error: false,
      message: 'Here are the events happening near you.',
      data: {
        eventsNearMe,
        totalEvents,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: `Server error, please try again later. ${error}`,
    });
  }
};

export {
  createEvent,
  getAllEvents,
  getEventById,
  getEventsByUserId,
  getEventsNearMe,
};
