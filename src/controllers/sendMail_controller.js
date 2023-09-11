const { StatusCodes } = require('http-status-codes');
const asyncWrapper = require('../middleware/async');
const createTransporter = require('../mailerConfig');
const getHtmlTemplate = require('../helpers/getHtmlTemplate');
const sendMail = asyncWrapper(async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Missing required fields: name, email, message' });
    }

    const transporter = await createTransporter();
    const mailOptions = {
      from: email,
      to: process.env.FROM_EMAIL,
      subject: `Message from ${name}`,
      text: message,
      html: getHtmlTemplate('contactUsSent.html', {
        name,
        email,
        message,
      }),
    };
    await transporter.sendMail(mailOptions);

    const confirmationMailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Message received`,
      text: `Message received`,
      html: getHtmlTemplate('contactUsConfirmSent.html', {
        name,
        email,
      }),
    };
    // Send the confirmation message to the user
    await transporter.sendMail(confirmationMailOptions);

    res.status(StatusCodes.OK).json({ message: 'Email sent successfully' });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error sending email', error: error.message });
  }
});

module.exports = {
  sendMail,
};
