const email = require("../nodemailer");

const EmailService = {
  async firstRegistration(owner, dogs) {
    email
      .send({
        template: "test",
        message: {
          to: owner.email,
        },
        locals: {
          name: dogs.map((dog) => {
            return dog;
          }),
        },
      })
      .then(console.log);
  },
};

module.exports = EmailService;
