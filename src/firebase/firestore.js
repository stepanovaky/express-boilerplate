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
  async addDog(owner, dogs) {
    await dogs.map((dog) => {
      const res = dogRef.doc(dog.callName).set(dog);
      const resOwner = dogRef
        .doc(dog.callName)
        .collection("owners")
        .doc(owner.email)
        .set(owner);
      console.log(resOwner, "subcollection owners");
    });
  },
  async findDogById(callName) {
    const doc = await dogRef.doc(callName).get();
    if (doc.exists) {
      return doc.data();
    } else {
      return { message: "No Dog Found" };
    }
  },
  async findDog(data) {
    const doc = await dogRef.where(data.findDogs, "==", data.dogItem);
    if (doc.exists) {
      return doc.data();
    } else {
      return { message: "No Dog Found" };
    }
  },
  async findOwnerByEmail(email) {
    console.log(email, "email");
    const doc = await primaryRef.doc(email).get();
    if (doc.exists) {
      return doc.data();
    } else {
      return { message: "No Owner Found" };
    }
  },
  async getEvents() {
    const eventList = [];
    const res = await eventsRef.get();
    res.forEach((doc) => {
      eventList.push(doc.data());
    });
    console.log("getevents", eventList);
    return eventList;
  },
  async updateEvents(data) {
    console.log(data, "database");
    console.log(data.eventId, "database event id");
    const item = await eventsRef
      .where("eventId", "==", data.eventId)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.exists) {
            console.log(doc.id);
            const res = eventsRef
              .doc(doc.id)
              .update({
                eventName: data.eventName,
                startDate: data.startDate,
                pdfUrl: data.eventPdfUrl,
                sanctionedPrice: data.sanctionedPrice,
                unsanctionedPrice: data.unsanctionedPrice,
              })
              .then((res) => console.log(res));
          }
        });
      });

    // console.log(doc);

    // .set({
    //   sanctionedPrice: data.sanctionedPrice,
    //   unsanctionedPrice: data.unsanctionedPrice,
    //   eventPdfUrl: data.eventPdfUrl,
    // });
  },
  async logEvent(owner, dogs, type) {
    const date = new Date().getTime();
    console.log(date, "date");
    const res = await logsRef.doc(`${date}`).set({
      ...owner,
      dogs: dogs,
      type: type,
    });
    console.log("logged", res);
  },
  async getLogs() {
    const logList = [];
    const res = await logsRef.get();
    res.forEach((doc) => {
      logList.push({ ...doc.data(), id: doc.id });
    });
    console.log("getLogs", logList);
    return logList;
  },
};

module.exports = database;
