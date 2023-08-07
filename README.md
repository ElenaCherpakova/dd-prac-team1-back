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
3. Obtain API key for [OPEN AI](https://platform.openai.com/account/api-keys)
4. Copy the `.env.example` file and rename it to `.env`: 
```
cp .env.example .env
```
5. Replace the placeholders with your specific values:

```PORT = <your_desired_port_number>
MONGO_URI = "<your_mongodb_connection_url>"
JWT_SECRET = <your_unique_jwt_secret_key>
JWT_LIFETIME = <your_desired_jwt_lifetime>
SESSION_SECRET = <your_unique_session_secret_key>
NODE_ENV=<your_environment>
OPENAI_API_KEY = <your_openai_api_secret_key>
```

6. Run `npm run start` to start the development server
7. The app will be served at <http://localhost:3000/>.
8. Your back-end server is now running. You can now run the front-end app.

# MongoDB Configuration

MongoDB is used to store user data, recipes, and manage user sessions. 
he database structure includes collections for users and recipes, as well as a session store for user authentication.

1. Session Configuration. Session handling is crucial for user authentication and maintaining user state. 
The express-session package is used along with connect-mongodb-session to manage sessions and store them in MongoDB.

2. User Schema. The user schema defines the structure of user data stored in the MongoDB database. 
It stores user information, including usernames, email addresses, and hashed passwords. 
The schema also includes methods for password hashing, JWT token creation, and password comparison

3. The recipe schema defines the structure of recipe data stored in the MongoDB database. 
It stores recipe information, including recipe name, ingredients, serving size, cooking instructions, nutrition info, meal preparation time, recipe category, special diet type, recipe tags, complexity level and meal image. 
It uses subdocuments for recipe ingredients and tags.