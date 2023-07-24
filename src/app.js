/*module setup*/
require('express-async-errors');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const app = express();
// const axios = require('axios');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const session_params = require('./sessionConfig');

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/v1/query', async (req, res) => {
  const query = 'pomegranate';
  const assistant = `You are a helpful assistant that generates cooking recipes based on user input. It can be just one word and can be several ones.
  Return response in the following parsable JSON format:

  {
    "title": "Recipe title",
    "ingredients": [{
      "name": "ingredient 1",
      "quantity": "quantity 1",
    },
    {
      "name": "ingredient 2",
      "quantity": "quantity 2",
 
    },
    {
      "name": "ingredient 3",
      "quantity": "quantity 3",
      
    }
  ],
    "instructions": [
      "instruction 1",
      "instruction 2",
      "instruction 3"
    ]
    servingFor: "quantity" 
    prepTimeInSeconds: "min"
    cookTimeInSeconds: "min"
    totalTimeInSeconds: "min"
    nutritionInformation: "nutrition information"
    images: [
      "image 1",
    ]
  }
`;
  console.log(query);
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: assistant,
        },
        {
          role: 'user',
          content: `User asks: Give me a recipe with ${query}.`,
        },
      ],

      temperature: 1,
      max_tokens: 356,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const completionMessage = response.data.choices[0].message.content;
    console.log(completionMessage);
    const responseObject = JSON.parse(completionMessage);
    console.log(responseObject);
    return res.json({ response: responseObject });
  } catch (error) {
    console.error(error);
  }
});

/*security packages*/
const cors = require('cors');
const favicon = require('express-favicon');
const logger = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');

/*routes*/
const mainRouter = require('./routes/mainRouter.js');
const authRouter = require('./routes/auth_routes.js');

/* middleware */
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session(session_params));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

/* routes */
app.use('/api/v1', mainRouter);
app.use('/api/v1/auth', authRouter);

module.exports = app;
