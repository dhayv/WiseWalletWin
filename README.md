# SpendSmart
A monthly budget program that helps you determine how much you have to spend in expenses for your next your pay check.

Personal Finance Management App

Project Overview

This full-stack web application helps users manage their personal finances by tracking income, logging expenses, and planning budgets. It provides a comprehensive toolset for financial oversight and analysis, designed to improve financial literacy and decision-making.

Technologies Used

Backend
FastAPI: Used for its rapid development capabilities and ease of use, serving as the backbone for creating scalable APIs.
SQLAlchemy with SQLite: Managed through SQLModel, this setup handles database operations efficiently, facilitating robust data manipulation and retrieval.
CORS Middleware: Ensures secure cross-origin requests, critical for integrating the ReactJS frontend with the FastAPI backend.
PyTest: Implements thorough testing of all API endpoints, ensuring they perform as expected before moving forward to frontend integration.

Frontend
ReactJS: Builds a responsive and user-friendly interface, allowing users to interact seamlessly with the application.
Node API using Axios: Employs Axios to handle HTTP requests, connecting the frontend to the backend efficiently.
JWT Authentication: Provides a secure login system, maintaining user confidentiality and data integrity.

Containerization and Deployment
Docker and Docker-Compose: Utilizes Docker for containerizing the application, ensuring consistency across various development and production environments. Docker-Compose is used to orchestrate the containers, simplifying the build and deployment process.
DigitalOcean: Plans for deployment on DigitalOcean to host the application, offering reliable and scalable cloud hosting.

Features
Secure User Authentication: Utilizes JWT for robust security during user registration and login processes.
CRUD Operations: Allows users to add, update, retrieve, and delete financial entries, supporting comprehensive financial management.

Financial Insights: Offers analytical tools to visualize financial health, track expenditures, and assess budget compliance.

(Notes)
I decided to abandon the idea of incorporating Flask into my project. Moving forward, the project will be based on using FastAPI and a database. I plan to use Pydantic models to feed user data to the API, which will be connected and stored in a SQLite database using SQLAlchemy to perform CRUD operations. I am going to focus on developing the backend first and then work my way backwards from the ground up.

I have started a new Python file called main.py, which initializes FastAPI using their documentation. After displaying the basic "hello world" message, I began by creating a route to PUT the user's income and an associated data model to accompany it. I did the same for expenses. Next, I will proceed to transition my Pydantic models to SQLModel.

From there, classes were created to model the data. I created a database.py file to create the engine of the database, which will be used to power and create the database. It was necessary to convert the BaseModel classes to SQLModel subclasses. I went about splitting my main file's code into different files/folders, turning my single file into a larger directory and linking all the file paths to their proper channels to all lead back to the main.py file. It was challenging at first but rewarding.

A significant issue I encountered was when the on_event for FastAPI was deprecated in favor of a lifespan event. The documentation briefly explained this change but did not detail how to properly replace it. I attempted to use Starlette events, upon which FastAPI is built, but to no avail. I also found myself clueless on how to address the issue due to its limitations I scoured the internet and youtube eventually to return to the documentation. Consequently, I had to change from @app.on_event("startup") to @asynccontextmanager from contextlib.

After addressing that issue, I faced another problem: my database file was not being created upon starting the function on startup. Initially, I had to correct the event in my main.py file; I was not properly adding "yield." I mistakenly thought it was an optional phrase, but it is necessary to properly pass lifespan into the FastAPI function, which solved one part of the problem. However, the main issue was still not addressed in the documentation: the path to access the database file was to use "sqlite:////db.sqlite3" or "sqlite:////{sqlite_file_name}." This was my main yet simplest issue, to my dismay. I needed to get the file into my relative project directory, not the absolute root of my file system. What solved my issue was something as simple as "sqlite:///./db.sqlite3." I literally ran across the room, relieved at finally seeing the "create table" command in my terminal. The log information that printed "Database Created" was incredibly refreshing.