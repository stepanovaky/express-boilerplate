const database = require("../firebase/firestore");
const SerializeService = require("./serialize-service");
const EmailService = require("./email-service");

const FirstTimeRegistrationService = {
  async first(data) {
    // console.log(data, "first registration");
    // console.log(data.owner, "added dogs to owner");
    const owner = await SerializeService.serializeOwner(data.owner);

    data.dogs.map((dog, index) => {
      data.secondaryOwner.map((owner, k) => {
        if (index === k) {
          dog.secondaryOwner = owner ? owner.secondary : null;
        }
      });
    });
    const dogs = await SerializeService.serializeDog(data.dogs);
    // console.log(dogs, "added secondary");
    // const secondaryOwner = await SerializeService.serializeSecondary(
    //   data.secondaryOwner
    // );
    database.addOwner(owner, dogs);
    EmailService.firstRegistration(owner, dogs);
  },
};

module.exports = FirstTimeRegistrationService;
