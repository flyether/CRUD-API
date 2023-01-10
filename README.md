# CRUD-API
CRUD-API  The Rolling Scopes School task
# CRUD-API
CRUD-API  The Rolling Scopes School task

https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md
Task implemented on Typescript
Done 2023-01-10/ deadline 2023-01-17

Score: 202/ 202

To run the application:

Clone the repository https://github.com/flyether/CRUD-API.git
Go to the develop branch (download it first : git checkout -b develop origin/develop)
Install dependencies
npm i
How to use
Run application

development mode

npm run start:dev

development mode

npm run start:prod

starts multiple instances

npm run start:multi

starts tests

npm run test

Use Postman or something like send below requests:
example: http://localhost:4000/api/users

get all user objects

GET api/users

get user object by id

GET api/users/userId

create new user object

POST api/users

update existing user object

PUT api/users/userId

delete existing user object

DELETE api/users/userId

JSON in body:

{
"username": "Hanna",
"age": 33,
"hobbies": ["drinking"]
}

id — unique identifier (string, uuid) generated on server side

username — user's name (string, required)

age — user's age (number, required)

hobbies — user's hobbies (array of strings or empty array, required)
