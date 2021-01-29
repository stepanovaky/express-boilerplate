const xss = require("xss");
const getYear = require("date-fns/getYear");
const { nanoid } = require("nanoid");

// registrationStatus = 'current' || 'expired' || 'renewed'

const SerializeService = {
  async serializeOwner(data) {
    console.log(data, "serialize owner");
    const ownerInfo = {
      fullName: xss(data.firstName + " " + data.lastName),
      email: xss(data.email),
      mobile: xss(data.mobile),
      landline: xss(data.landline),
      address: xss(data.addressOne + " " + data.addressTwo),
      zipcode: xss(data.zipCode),
      city: xss(data.city),
      state: xss(data.state),
    };
    return ownerInfo;
  },
  async serializeDog(data) {
    console.log(data, "serialize dogs");
    const expirationYear = getYear(new Date());
    const expirationDate = new Date(expirationYear, 11, 31);
    const serializedDogs = data.map((dog, index) => {
      return {
        registeredName: xss(dog.registeredName),
        callName: xss(dog.callName),
        registrationNumber: xss(dog.ackNumber),
        microchip: xss(dog.microchip),
        breed: xss(dog.breed),
        dob: xss(dog.dob),
        gender: xss(dog.gender),
        registrationPapers: xss(dog.registrationPapers),
        registrationPapersUrl: xss(
          dog.registrationPapersUrl ? dog.registrationPapersUrl : null
        ),
        exp: expirationDate,
        sanctionId: nanoid(4).toLowerCase(),
        primaryOwners: [],
        secondaryOwners: dog.secondaryOwner
          ? dog.secondaryOwner.map((owner) => {
              return {
                fullName: xss(owner.firstName + " " + owner.lastName),
                email: xss(owner.email),
              };
            })
          : null,
        registrationStatus: "current",
      };
    });
    return serializedDogs;
  },
};

module.exports = SerializeService;
