const database = require("../firebase/firestore");
const SerializeEvents = require("./serialize-event");

const EventsService = {
  async getAllEvents() {
    const eventsList = await database.getEvents();
    return eventsList;
  },
  async updateEvents(data) {
    const serializedData = await SerializeEvents.serializeUpdateEvents(data);

    const res = await database.updateEvents(serializedData);
  },
};

module.exports = EventsService;
