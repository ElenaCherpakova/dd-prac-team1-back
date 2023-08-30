const { StatusCodes } = require('http-status-codes');
const asyncWrapper = require('../middleware/async');
const createTransporter = require('../mailerConfig');

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
      html: `
            <h2>New Message from ${name}</h2>
            <p><strong>Email To Reply:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
    `,
    };
    await transporter.sendMail(mailOptions);
    const confirmationMsg = `Thank you for reaching out! We've received your msg and will respond ASAP.`;

    const confirmationMailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Message received`,
      text: confirmationMsg,
      html: `
            <b>${confirmationMsg}</b>`,
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
