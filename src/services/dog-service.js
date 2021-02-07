const database = require("../firebase/firestore");

const DogService = {
  async findDogByCallName(callName) {
    console.log(callName, "dogservice");
    if (callName) {
      const dog = await database.findDogById(callName);

      return dog;
    }
  },
  async findDogByOther(data) {
    if (data) {
      const dog = await database.findDog(data);
      console.log(dog, "dog service");
      return dog;
    }
  },
};

module.exports = DogService;
