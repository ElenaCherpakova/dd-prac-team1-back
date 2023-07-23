## One Line Description
Created User model, authorization controller and authorization routes.
## Requirements
/- authController authorization constroller to handle the user authontication related operations such as such as user registration and login. 
/- auth_routes defines the routes related to user authentication.
/- User model represents the structure and behavior of a user entity in the database

_What this code should do_
/- auth_controller: it validates the input data, checks the duplicate emails, handls auth errors by throwing appropriate error responses.
/- auth_routes  uses the Express Router to create route handlers for user registration and login.
/- User.js in models defines how user-related data is organized, stored, and retrieved from the database.
## Notes

_Any additional info_

## Test Steps

_Instructions on how to test the changes_

/- can be checked either by postman and Thunder clients in VS. Thunder Client involves sending HTTP requests to the endpoints defined in the auth_routes and examining the responses to ensure they behave as expected.

/- Guide:
/- install the Thunder client in VS
/- within Thunder create a collection and name it. Collections are used to organize API requests.
/- Within the collection, create two requests: one for user registration and another for user login.
For user registration, set the request method to POST and set the URL to your backend API's register endpoint (e.g., http://localhost:8000/api/v1/auth/register).
For user login, set the request method to POST and set the URL to backend API's login endpoint (e.g., http://localhost:8000/api/v1/auth/login).
/- For both requests, set the necessary headers (e.g., Content-Type: application/json) to indicate that we are sending JSON data in the request body.
In the request body, provide the required fields (e.g., username, email, password, etc.) with sample data to test the endpoints. Need to make sure to use valid data that adheres to any validation rules you have in place.
/- click on the "Send Request" for each request to send the HTTP request to backend server.
/- check the response received for the requests, any errors, or status code.
/- For user registration, the response should have a successful status code (e.g., 201 Created) and a JSON object with user data and a token.
/- For user login, the response should contain a successful status code (e.g., 200 OK) and a JSON object with user data and a token.

## Checklist

- The Linear ID is in the PR title
- My code follows best practices
- Documentation is included where needed
