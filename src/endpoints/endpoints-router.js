const {
  registrationRouter,
  jsonParser,
  dogRouter,
  eventsRouter,
  ownerRouter,
  logRouter,
} = require("../express");
const ValidationServices = require("../services/1. validation-services");
const FirstTimeRegistrationService = require("../services/firstTimeRegistration-service");
const EventsService = require("../services/events-services");
const DogService = require("../services/dog-service");
const LogService = require("../services/log-service");
const OwnerService = require("../services/owner-service");

registrationRouter
  .route("/api/first/registration")
  .post(jsonParser, async (req, res, next) => {
    ValidationServices.validate(req.body.data);
    FirstTimeRegistrationService.first(req.body.data);

    res.status(200).json({ message: "success" });
  });

eventsRouter.route("/api/get/events").get(async (req, res, next) => {
  const events = await EventsService.getAllEvents();
  res.status(200).json({ events });
});

eventsRouter
  .route("/api/update/events")
  .put(jsonParser, async (req, res, next) => {
    const data = req.body;
    const updateData = await EventsService.updateEvents(data);
  });

ownerRouter.route("/api/find/owner").get(async (req, res, next) => {
  const ownerToFind = req.headers["data"];
  const parsedOwner = JSON.parse(ownerToFind);
  if (parsedOwner.findOwner === "email") {
    const owner = await OwnerService.findOwnerByEmail(parsedOwner.ownerItem);
    res.status(201).json({ owner });
  }
});

dogRouter.route("/api/find/dog").get(async (req, res, next) => {
  const dogToFind = req.headers["data"];
  const parsedDog = JSON.parse(dogToFind);
  if (parsedDog.findDogs === "callName * preferred") {
    const dog = await DogService.findDogByCallName(parsedDog.dogItem);
    res.status(200).json({ dog });
    console.log(dog);
  } else {
    const dog = await DogService.findDogByOther(parsedDog);
    console.log(dog);
    res.status(200).json({ dog });
  }
});

logRouter.route("/api/get/all/logs").get(async (req, res, next) => {
  const log = await LogService.getAllLogs();
  res.status(200).json({ log });
  console.log(log);
});

module.exports = {
  registrationRouter,
  eventsRouter,
  dogRouter,
  logRouter,
  ownerRouter,
};
