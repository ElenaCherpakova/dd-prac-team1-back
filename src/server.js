require('dotenv').config();
const PORT = process.env.PORT;
const app = require('./app');
const connectDB = require('../db/connect');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Listening on Port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};
start();

