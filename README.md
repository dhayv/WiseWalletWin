# Currently migrating

## Table of Contents

- [Migration update](migration-update)
  - [Why Docker](#why-docker)
  - [Deployment Environment Change](#deployment-environment-change)
  - [Benefits](#benefits)
- [Application Overview](#application-overview)
  - [Screenshot](#screenshot)
  - [Video](#video)
- [Technologies Used](#technologies-used)
  - [Backend](#backend)
  - [Database](#database)
  - [Frontend](#frontend)
  - [Containerization and Deployment](#containerization-and-deployment)
    - [CI/CD with GitHub Actions](ci/cd-with-gitHub-ctions)
- [Features](#features)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Author](#author)


### Migration Update

We are currently migrating our application from a SQLite relational database to a NoSQL MongoDB Atlas for persistent storage. This migration is part of a broader strategy to enhance scalability, flexibility, and ease of deployment.

### Why Docker?

I ama containerizing the entire application now using Docker to streamline deployment across different environments. Docker allows me to encapsulate the application and its dependencies into a portable container, ensuring consistency and reducing the "it works on my machine" problem. By storing our Docker images on Docker Hub, we can integrate seamlessly with CI/CD pipelines, enabling continuous integration and delivery. Additionally, Docker and MongoDB provide the flexibility to "pick up and go" as needed, making it easier to move or scale our application across different environments.

### Deployment Environment Change

As part of this migration, we are also transitioning from an AWS EC2 instance to AWS Lightsail. Lightsail provides a simpler, more cost-effective platform that aligns better with our current performance while still staying in the AWS ecosystem.

### Benefits

- **Portability:** Docker containers make it easier to deploy our app across different environments without worrying about underlying system differences.
- **Flexibility:** Docker and MongoDB allow us to easily move or scale our application as needed, providing greater adaptability.
- **Consistency:** The same container image will run in development, staging, and production, reducing environment-specific bugs.
- **CI/CD Integration:** Docker Hub facilitates smoother continuous integration and continuous delivery processes, speeding up development cycles.
- **Cost Efficiency:** Migrating to AWS Lightsail offers a more cost-effective hosting solution without sacrificing necessary performance.


# Wise Wallet Win APP

> Wise Wallet Win is a comprehensive financial application designed to streamline and simplify the way users track their bi-weekly checks. Experience it firsthand: [WiseWalletWin](https://wisewalletwin.com)


# Application Overview

Wise Wallet Win is a full-stack web application dedicated to helping users manage their personal finances efficiently. Originally built to help my girlfriend and me keep track of our monthly expenses, this application informs us how much we need to allocate from our bi-weekly checks, effectively eliminating the need for cumbersome spreadsheets.

By tracking income and logging expenses, users can easily monitor their financial health from paycheck to paycheck, enhancing decision-making and financial planning through a seamless and intuitive interface.

The application employs a robust technology stack, including a SQLite database, a React-powered user interface, and a FastAPI server ensuring secure, efficient data management and communication. The entire system is deployed on AWS ECS, ensuring high availability and scalability.

### Screenshot

![Alt](./images/screenshot.png)

### Video

[Link to Video](./images/video.mov)

## Technologies Used

### Backend

- **FastAPI:** Chosen for its rapid development capabilities and ease of use, serving as the backbone for creating scalable APIs.
- **SQLModel:** A library for interacting with SQL databases using Python objects, designed to be intuitive, easy to use, highly compatible, and robust. Powered by Pydantic and SQLAlchemy.
- **CORS Middleware:** Ensures secure cross-origin requests, essential for integrating the ReactJS frontend with the FastAPI backend.
- **JWT and OAuth2 Authentication:** Provides a secure and reliable login system, maintaining user confidentiality and data integrity.
- **PyTest:** Implements comprehensive testing of all API endpoints to ensure reliability before integration with the frontend.

### Database

- **SQLite:** A lightweight and efficient database solution for handling user data.

### Frontend

- **ReactJS:** Powers a responsive and user-friendly interface, enabling users to create accounts, log in, and manage their income and expenses.
- **Axios:** Handles HTTP requests, ensuring smooth communication between the frontend and backend.

### Containerization and Deployment

- **GitHub Actions:** Automates the CI/CD pipeline, ensuring seamless code integration and deployment.
- **Docker:** Containerizes the backend application for consistency across development and production environments.
- **AWS:** Deployed on Amazon AWS for reliable and scalable cloud hosting.
- **Nginx:** A high-performance web server and reverse proxy, serving the frontend and proxying requests to the backend API.
- **Certbot:** Automates the use of Let's Encrypt for enabling HTTPS, ensuring secure communication.
- **Systemd:** Manages the lifecycle of backend and frontend services, ensuring they start on boot and restart on failure.

### CI/CD with GitHub Actions

GitHub Actions is used to automate the CI/CD pipeline for the Wise Wallet Win application. The pipeline includes steps to SSH into the server and rsync the necessary files for deployment.

## Features

- **Secure User Authentication:** Employs JWT for robust security during user registration and login processes.
- **Comprehensive Financial Management:** Supports CRUD operations, allowing users to add, update, retrieve, or delete financial entries.
- **Responsive Design:** Ensures a seamless user experience across various devices.
- **Efficient Data Handling:** Provides real-time updates and synchronization of financial data.

## Contribution Guidelines

We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Submit a pull request detailing your changes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Thanks to the open-source community for providing invaluable resources and tools.
- Special thanks to my girlfriend for the inspiration behind this project.

---

Wise Wallet Win is not just an application; it is a step towards financial clarity and empowerment. Check it out and take control of your finances today!

## Author

Dhayv
