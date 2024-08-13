# Your Car Your Way

## Introduction
This is a proof of concept (POC) for the future chat support system of Your Car Your Way.

The frontend is built with Angular, and styling is handled with TailwindCSS.

The backend is built with Spring Boot.

Disclaimer: At this stage, it is still a basic chat application, primarily focused on enabling communication between a client and a support assistant. Several optimizations are needed, including database normalization, code optimization, and more.


## Running Development servers

To run the frontend 
```
cd front
npm start
```

To run the backend

```
cd back
mvn spring-boot:run
```

## Database

You will need PostgreSQL installed, and a database named `ycyw` should be created.

To configure the database, simply copy the contents of application.properties.example and enter your database username and password with the credentials you previously created for the `ycyw` database.

Dummy data will be automatically added to the database when you run the `mvn spring-boot:run` command.

    