const OwnerService = require("../services/owner-service");
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
    const obj = {};
    const doc = await dogRef.doc(callName).get();
    if (doc.exists) {
      obj.dog = doc.data();
    } else {
      return { message: "No Dog Found" };
    }
    const snapshot = await dogRef.doc(callName).collection("owners").get();
    snapshot.forEach((doc) => {
      obj.owner = doc.data();
    });
    return obj;
  },
  async findDog(data) {
    console.log(data, "find dog");
    const snapshot = await dogRef
      .where(data.findDogs, "==", data.dogItem)
      .get();
    const obj = {};
    snapshot.forEach((doc) => {
      console.log(doc.data());
      obj.dog = doc.data();

      const fetchOwner = async (id) => {
        const obj2 = {};
        const snapshot = await dogRef.doc(id).collection("owners").get();
        snapshot.forEach((doc) => {
          console.log(doc.data(), "fetch owner");
          obj2.owner = doc.data();
          return doc.data();
        });
        obj.owner = obj2.owner;
        console.log(obj2, "object 2");
      };
      const owner = fetchOwner(doc.id);
      let p = new Promise((resolve, reject) => {
        if (owner) {
          resolve((obj.owner = owner));
        } else {
          reject("failed");
        }
      });

      p.then((res) => {
        console.log(res, "promise 2");
        return res;
      }).then((res) => {
        console.log(res, "promise 3");
      });

      // Promise.all(p);
      //one day, when I have the courage, I will refactor

      console.log(p, "promise");

      // const owner = fetchOwner(doc.id);

      console.log(owner, "fetchowner owner");
      // obj.owner = owner;
    });
    const wait = await obj.owner;
    return obj;
  },
  updateDog(data) {
    console.log(data);
    const dog = data.data;
    dogRef.doc(data.data.callName).update({
      dog,
    });

    if (data.data.date) {
      dogRef
        .doc(data.data.callName)
        .collection("times")
        .doc(data.data.date)
        .set({
          times: [
            {
              date: data.data.date,
              weight: data.data.weight,
              time: data.data.time,
            },
          ],
        });
    }
  },
  async getDogsOwner(dogs) {
    const querySnapshot = await dogRef
      .doc(dogs[0].callName)
      .collection("owners")
      .get();
    let owner;
    querySnapshot.forEach((doc) => {
      console.log(doc.id);
    });
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
  async getOneEvent(id) {
    const snapshot = await eventsRef.where("eventId", "==", id).get();
    let event;
    snapshot.forEach((res) => {
      event = res.id;
    });
    return event;
  },
  async addSanctionedRegistrationToEvent(id, dogs) {
    dogs.map((dog) => {
      eventsRef.doc(id).collection("sanctioned").doc(dog.callName).set({
        dog,
      });
    });
  },
  async addUnsanctionedRegistrationToEvent(id, owner, dogs) {
    dogs.map((dog) => {
      const callName = [dog, owner[0]];
      eventsRef.doc(id).collection("unsanctioned").doc(dog.callName).set({
        dog: dog,
        owner: owner[0],
      });
    });
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
