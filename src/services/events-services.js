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
  async addSanctionedRegistration(data) {
    console.log(data);
    console.log(data.eventId);
    const event = await database.getOneEvent(data.eventId);
    await database.logEvent("primary", data.addedDogs, "Sanctioned Registration");
    await database.addSanctionedRegistrationToEvent(event, data.addedDogs);
  },
};

module.exports = EventsService;
