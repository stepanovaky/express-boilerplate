const { registrationRouter, jsonParser } = require("../express");
const ValidationServices = require("../services/1. validation-services");
const FirstTimeRegistrationService = require("../services/firstTimeRegistration-service");

registrationRouter
  .route("/api/first/registration")
  .post(jsonParser, async (req, res, next) => {
    console.log(req.body, "router");
    ValidationServices.validate(req.body.data);
    FirstTimeRegistrationService.first(req.body.data);

    res.status(200).json({ message: "success" });
  });

module.exports = registrationRouter;
