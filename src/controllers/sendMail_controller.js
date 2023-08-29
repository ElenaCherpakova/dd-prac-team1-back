const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const asyncWrapper = require('../middleware/async');
const sgMail = require('../mailerConfig');

const sendMail = asyncWrapper(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    throw new BadRequestError('Missing required fields: name, email, message');
  }

  const msg = {
    to: process.env.FROM_EMAIL,
    from: process.env.FROM_EMAIL, // Use the email address or domain you verified above
    replyTo: email,
    subject: `Message from ${name}`,
    text: message,
    html: `
        <h2>New Message from ${name}</h2>
        <p><strong>Email To Reply:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
`,
  };
  const confirmationMsg = {
    to: email,
    from: process.env.FROM_EMAIL, // Use the email address or domain you verified above
    subject: `Message received`,
    templateId: process.env.TEMPLATE_ID,
    dynamicTemplateData: {
      name,
    },
  };

  try {
    await sgMail.send(msg);
    // Send the confirmation message to the user
    await sgMail.send(confirmationMsg);
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
