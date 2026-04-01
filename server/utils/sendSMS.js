const axios = require("axios");


const sendSMS = async (number, otp) => {
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q", 
        variables_values: otp,
        numbers: [number],
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("FULL ERROR:", error.response?.data);

    console.log("SMS Sent:", response.data);
  } catch (error) {
    console.log("SMS Error:", error.response?.data || error.message);
  }
};

module.exports = sendSMS;