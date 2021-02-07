const database = require("../firebase/firestore");
const EmailService = require("./email-service");
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
    const owners = await database.getDogsOwner(data.addedDogs);
    database.logEvent("primary", data.addedDogs, "Sanctioned Registration");
    database.addSanctionedRegistrationToEvent(event, data.addedDogs);
  },
  async addUnsanctionedRegistration(data) {
    console.log(data);
    console.log(data.eventId);
    const event = await database.getOneEvent(data.eventId);
    database.logEvent(data.owners[0], data.dogs, "Unsanctioned Registration");
    database.addUnsanctionedRegistrationToEvent(event, data.owners, data.dogs);
  },
};

module.exports = EventsService;
