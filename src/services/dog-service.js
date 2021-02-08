const { deleteTheDog } = require("../firebase/firestore");
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
  async deleteDog(data) {
    console.log(data);
    database.deleteTheDog(data.data);
  },
  async findOwnerByEmail(email) {
    const owner = await database.findOwnerByTheEmail(email);
    return owner;
  },
  async updateOwner(owner) {
    await database.updateTheOwner(owner);
  },
  async deleteOwner(owner) {
    await database.deleteTheOwner(owner);
  },
};

module.exports = DogService;
