const database = require("../firebase/firestore");

const OwnerService = {
  async findOwnerByEmail(email) {
    const owner = database.findOwnerByEmail(email);
    return owner;
  },
};

module.exports = OwnerService;
