const database = require("../firebase/firestore");
const EmailService = require("./email-service");
const SerializeEvents = require("./serialize-event");

const EventsService = {
  async addEvent(data) {
    await database.addTheEvent(data);
  },
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
    const owner = await database.getDogsOwner(data.addedDogs);
    database.logEvent(owner, data.addedDogs, "Sanctioned Registration");
    // event = [res.id, res.data().eventName, res.data().startDate];
    EmailService.sanctionedEventRegistration(
      event[1],
      data.addedDogs,
      event[2],
      owner
    );
    database.addSanctionedRegistrationToEvent(event[0], data.addedDogs);
  },
  async addUnsanctionedRegistration(data) {
    console.log(data);
    console.log(data.eventId);
    const event = await database.getOneEvent(data.eventId);
    database.logEvent(data.owners[0], data.dogs, "Unsanctioned Registration");
    EmailService.unsanctionedEventRegistration(
      event[1],
      data.dogs,
      event[2],
      data.owners[0].email
    );
    database.addUnsanctionedRegistrationToEvent(
      event[0],
      data.owners,
      data.dogs
    );
  },
};

module.exports = EventsService;
