# NestJS Books API

## Features

- Create, Read, Update, and Delete books and topics
- Input validation with class-validator
- Auto-generated API documentation with Swagger
- Pagination support
- Filter books by title, author, or topic
- Error handling
- TypeScript support for type safety

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** 
- **MongoDB** 
- **npm** 

## Installation
## Setup Instructions

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anandkagathara/simbiotik_task
   cd simbiotik_task

2. **Install dependencies**:
   ```bash
   npm install

3. **.env set**
   as of now we don't need to set .env file

4. **run the application**
   ```bash
   npm run start:dev

5. **API Documentation**
   ```bash
   http://localhost:3000/api-docs

6. **Database check**
   you can find from app.module.ts file db atlas URL


7. **unit testing**
   Currently I write both same controller and service but we can also improve unit test cases
   you can test with npm run test:watch 