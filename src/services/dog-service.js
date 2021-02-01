const database = require("../firebase/firestore");

const DogService = {
  async findDogByCallName(callName) {
    const dog = database.findDogById(callName);
    return dog;
  },
  async findDogByOther(data) {
    const dog = database.findDog(data);
  },
};

module.exports = DogService;
