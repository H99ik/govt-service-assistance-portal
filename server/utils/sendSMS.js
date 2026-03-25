const axios = require("axios");

const sendSMS = async (number, message) => {
  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: message,
        language: "english",
        numbers: number,
      },
      {
        headers: {
          authorization: "hzU8bN5mi70BCuyQdRPZvOGsApeFK2H49wTYolftWq3rcgaIEMR8KnGsbxv1YFatyC74lzTfhQqUrJwA",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("SMS Error:", error.message);
  }
};

module.exports = sendSMS;