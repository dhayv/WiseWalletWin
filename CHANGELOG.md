# Changelog

All notable changes to this project will be documented here.

---

## [2.1.1] - 09-09-2024

### Refactored

- Updated logging to remove sensitive user information from API responses

### Fixed

- Fixed nexxt check calculations from over counting days.
- Improved UX by repositioning the "Add Expense" button.
- Made the Expense Table vertically scrollable for easier navigation.
- Corrected the remainder section to accurately predict future expenses.
- Fixed the date format to automatically update the next pay date when the current date has passed.
- Ensured username handling is now case-insensitive.

## [2.1.0] - 09-07-2024

### Added

- Added support for Safari browser compatibility in form submission.

### Fixed

- Fixed form submission issues in Safari where requests were blocked by CORS.
- Resolved expense list update issues after adding new expenses.
- The remainder section now accurately forecasts expense predictions.

## [2.0.0] - 09-05-2024

### Backend Changes

- **Database Migration**: Replaced **SQLite** with **MongoDB Atlas**, switching from a relational database to a NoSQL model for better scalability.
- **ORM Change**: Transitioned from **SQLModel** to **Beanie ORM**, enabling seamless MongoDB integration.
- **Containerization**: Backend container is now pushed to **Docker Hub**, ensuring consistency across environments.
- **Deployment**: Introduced a self-hosted **GitHub Actions** runner on **AWS EC2**, automatically pulling the latest container and updating the backend service during deployments.

### Frontend Changes

- **Framework Change**: Replaced **Create React App** with **Vite** for faster build times and better performance.
- **UI Libraries**: Integrated **React Bootstrap** and **Bulma CSS** for better UI components and responsiveness.
- **Static File Hosting**: Frontend static assets are now hosted on **AWS S3**, with caching via **CloudFront**.

### Infrastructure Changes

- **Nginx Removal**: Dropped **Nginx** as a reverse proxy, with **CloudFront** handling HTTPS redirection and caching.
- **SSL/TLS**: SSL certificates are now managed by **AWS ACM** for both frontend and backend services, ensuring secure communication.
- **CloudFront**: Configured **CloudFront** to cache frontend assets and enforce HTTP-to-HTTPS redirection.

### CI/CD Pipeline Updates

- **Backend**: The backend container is built, pushed to **Docker Hub**, and deployed via **GitHub Actions**. The EC2 instance pulls the latest container and restarts the backend service automatically.
- **Frontend**: The frontend is built and deployed to an **AWS S3** bucket, with **CloudFront** cache invalidation ensuring users receive the most up-to-date version.

## [1.0.0] - 04-15-2024 - Initial Release

### Features

- Full CRUD functionality for managing expenses.
- Income management with the ability to track, update, and plan income.
- Secure authentication with **JWT** and **OAuth2**.
- Real-time data synchronization across frontend and backend.
- Responsive UI built with **ReactJS** and powered by **FastAPI**.
- Frontend hosted on **AWS EC2** with **Nginx** and backend containerized with **Docker**.
- CI/CD automated via **GitHub Actions** with secure communications enabled by **Certbot**
