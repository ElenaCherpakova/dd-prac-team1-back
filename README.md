# Back-End Repo for Node/React Practicum

This repository contains the backend code for Node/React Practicum. 
It provides the necessary instructions to set up and run the backend.

### Running the project

1. Clone the repository onto your local device (following steps):
```
git clone git@github.com:Code-the-Dream-School/dd-prac-team1-back.git
cd dd-prac-team1-back
npm install
```
2. Set up Mongo database by installing [MongoDB](https://www.mongodb.com/)
3. Copy the `.env.example` file and rename it to `.env`: 
```
cp .env.example .env
```
4. Replace the placeholders with your specific values:

```PORT = <your_desired_port_number>
MONGO_URI = "<your_mongodb_connection_url>"
JWT_SECRET = <your_unique_jwt_secret_key>
JWT_LIFETIME = <your_desired_jwt_lifetime>
SESSION_SECRET = <your_unique_session_secret_key>
NODE_ENV=<your_environment>
OPENAI_API_KEY = <your_openai_api_secret_key>
```

5. Run `npm run start` to start the development server
6. The app will be served at <http://localhost:3000/>.
7. Your back-end server is now running. You can now run the front-end app.

