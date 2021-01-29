const db = require("./firebase");

const eventsRef = db.collection("events");
const dogRef = db.collection("dogs");
const primaryRef = db.collection("primaryOwners");
const logsRef = db.collection("logs");

const database = {
  async checkIfOwnerExists(email) {
    console.log(email, "email");
    const doc = await primaryRef.doc(email).get();

    // console.log(doc.data(), "doc data");

    if (doc.exists) {
      const data = await doc.data();
      return data;
      //   return doc.data();
    } else {
      return false;
    }
    //check if email doc exists
  },
  async addOwner(owner, dogs) {
    console.log(owner, "check what database has");
    const res = await primaryRef.doc(owner.email).set(owner);
    await dogs.map((dog) => {
      const resDogs = primaryRef
        .doc(owner.email)
        .collection("dogs")
        .doc(dog.callName)
        .set(dog);
      console.log(resDogs, "subcollection dogs");
    });
    console.log("registered", res);
  },
};

module.exports = database;
