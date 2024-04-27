# SpendSmartly APP

## Project Overview

This is a full-stack web applicationcreated to help users manage their personal finances by tracking income and logging expenses. It allows users to keep track of their expenses from check to check. The app is designed to improve decision-making without the need for a spreadsheet.

A sqlite database stores all data for the user, a UI is created using React and, a FAST API server is utilized to ensure proper security using JWT Oauth2, data validation using pydantic models, and communication.

## Technologies Used

### Backend

- **FastAPI:** Used for its rapid development capabilities and ease of use, serving as the backbone for creating scalable APIs.
- **SQLAlchemy with SQLite:** Managed through SQLModel, this setup handles database operations efficiently, facilitating robust data manipulation and retrieval.
- **CORS Middleware:** Ensures secure cross-origin requests, critical for integrating the ReactJS frontend with the FastAPI backend.
- **JWT and OAuth2 Authentication:** Provides a secure login system, maintaining user confidentiality and data integrity.
- **PyTest:** Implements thorough testing of all API endpoints, ensuring they perform as expected before moving forward to frontend integration.

### Database

- **SQLite:** Used to create a lightweight database.

### Frontend

- **ReactJS:** Built a responsive and user-friendly interface, allowing users to create an account, login, and add their income and expense data.
- **Node API using Axios:** Uses Axios to handle HTTP requests, connecting the frontend to the backend efficiently.

### Containerization and Deployment

- **GitHub Actions:** Used to create a CI/CD pipeline.
- **Docker and Docker-Compose:** Utilizes Docker for containerizing the application, ensuring consistency across various development and production environments. Docker-Compose is used to orchestrate the containers, simplifying the build and deployment process.
- **DigitalOcean:** Plans for deployment on DigitalOcean to host the application, offering reliable and scalable cloud hosting.

## Features

- **Secure User Authentication:** Utilizes JWT for robust security during user registration and login processes.
- **CRUD Operations:** Allows users to add, update, retrieve, and delete financial entries, supporting comprehensive financial management.

### `mypy.ini`

This project uses `mypy` for static type checking to maintain high code quality and consistency. The `mypy.ini` file contains configurations that define the rules and behaviors of `mypy` checks.

#### What's Configured?

- **Ignore missing imports** to avoid errors on third-party libraries not having type hints.
- **Specific error suppressions** for known issues that do not impact functionality.
