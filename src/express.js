const express = require("express");
const registrationRouter = express.Router();
const jsonParser = express.json();

module.exports = { registrationRouter, jsonParser };
