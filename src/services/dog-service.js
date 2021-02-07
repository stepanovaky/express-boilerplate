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
  async updateDog(data) {
    console.log(data);
    database.updateDog(data);
  },
};

module.exports = DogService;
