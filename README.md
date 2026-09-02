# GameStoreApp

A full-stack game store web application built with **React + TypeScript** on the frontend and **Spring Boot + MySQL** on the backend.

The project evolved from a simple game catalogue into a complete e-commerce-style platform with game discovery, filtering and search, user authentication, wishlist and cart management, game ownership, transaction history, and an administrator panel.

## ✨ Features

### 🎮 Game Discovery

- Browse the game catalogue using a responsive card-based interface.
- Filter games by category and maximum price.
- Combine multiple categories when filtering.
- Sort games by:
  - Price
  - Title
  - Highest discount
- Display discounted games with their original price, final price, and discount percentage.
- Search games and categories through an autocomplete search bar.
- Navigate directly from search suggestions to a game or category.
- Highlight games that are already owned by the authenticated user.
- Category navigation through a dedicated menu and category carousel.

### 🔐 Authentication & Authorization

- User registration and login.
- Stateless authentication using **JWT**.
- Passwords stored using secure password hashing with Spring Security's password encoder.
- JWT-based session persistence on the frontend.
- Global authentication state using React Context.
- Role-based authorization with:
  - `ROLE_USER`
  - `ROLE_ADMIN`
- Protected backend endpoints and administrator-only operations.

### 🛒 E-commerce Flow

Authenticated users can manage the complete journey from discovering a game to owning it:

`Browse → Wishlist → Cart → Checkout → Library`

The application supports:

- Add/remove games from a wishlist.
- Add/remove games from the shopping cart.
- Move games from the wishlist directly to the cart.
- Checkout the current cart.
- Prevent duplicate ownership of games.
- Automatically remove purchased games from the wishlist.
- Clear the cart after a successful purchase.
- Store the purchased price for historical transaction accuracy.
- View all owned games in a personal library.
- View an ordered transaction/purchase history.

### 👤 User Profile

The profile area uses nested React Router routes and provides separate sections for:

- Account details
- Password change
- Wishlist
- Shopping cart
- Owned games / library
- Transaction history

The UI is role-aware, showing user-specific functionality to regular users and administrative functionality to administrators.

### 🛠️ Admin Panel

Administrators have access to a dedicated management interface with:

- View all registered users.
- Delete user accounts.
- Manage the global game catalogue.
- Create new games.
- Update existing games through inline editing.
- Delete games.
- Revoke a specific game from a user's library.

All `/api/admin/**` operations are protected by role-based authorization on the backend.

## 🏗️ Architecture

GameStoreApp follows a client-server architecture:

```text
┌──────────────────────────────┐
│       React Frontend         │
│   TypeScript + Vite          │
│   React Router + Bootstrap   │
└──────────────┬───────────────┘
               │ HTTP / REST API
               │ JWT Authorization
               ▼
┌──────────────────────────────┐
│       Spring Boot API        │
│  Controllers → Services      │
│  DTOs → Repositories         │
│  Spring Security + JWT       │
└──────────────┬───────────────┘
               │ JPA / Hibernate
               ▼
┌──────────────────────────────┐
│            MySQL             │
│ Games · Users · Cart ·       │
│ Wishlist · Library ·         │
│ Transactions                 │
└──────────────────────────────┘
```

The backend is organized into separate layers for controllers, services, repositories, entities/models, DTOs, security, and configuration. The project also uses DTOs to define stable API response/request contracts instead of exposing persistence entities directly.

## 🔧 Technology Stack

### Frontend

- **React 18**
- **TypeScript**
- **Vite**
- **React Router**
- **Bootstrap 5**
- **React Icons**
- **jwt-decode**
- **ESLint**

The frontend is implemented as a Single-Page Application with nested routing for the profile area and centralized authentication state through React Context. fileciteturn4file0

### Backend

- **Java 21**
- **Spring Boot 3.5.5**
- **Spring Web**
- **Spring Data JPA / Hibernate**
- **Spring Security**
- **JWT (JJWT 0.11.5)**
- **MySQL**
- **Maven**
- **Lombok**

The backend uses Spring Boot's layered application structure and includes dedicated controllers, services, repositories, DTOs, models, configuration, and security packages. fileciteturn6file0 fileciteturn14file0

## 📁 Project Structure

```text
GameStoreApp/
│
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/gamestore/backend/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       ├── schema.sql
│   │   │       └── data.sql
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── Frontend/
│   ├── src/
│   │   ├── assets/components/
│   │   ├── config/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

The repository currently keeps the frontend and backend as separate applications under `Frontend/` and `Backend/`. fileciteturn1file0

## 🔌 Main REST API Areas

The backend exposes REST endpoints grouped around the application's main domains:

| Area | Purpose |
|---|---|
| `/api/authentication/**` | Registration and login |
| `/api/games/**` | Game catalogue, filtering and search |
| `/api/users/**` | Current user profile and password management |
| `/api/wishlist/**` | Wishlist management |
| `/api/cart/**` | Cart management and checkout |
| `/api/library/**` | Owned games |
| `/api/transactions/**` | Purchase history |
| `/api/admin/**` | Administrator operations |

The API was progressively refactored to use DTOs for game responses and search suggestions, while keeping authentication and administrative functionality protected through Spring Security. The controller layer currently includes dedicated controllers for authentication, games, users, wishlist, cart, library, transactions, and administration. fileciteturn16file0

## 🔄 Purchase Flow

The checkout operation is implemented as an atomic backend transaction. Conceptually, a successful checkout performs the following operations:

```text
Cart
 │
 ├──► Add games to User Library
 │
 ├──► Create Transaction records
 │
 ├──► Remove purchased games from Wishlist
 │
 └──► Clear Cart
```

Using a transactional service prevents partial completion of the purchase workflow and helps keep the cart, library, wishlist, and transaction data consistent.

## 🔒 Security Design

Security is implemented at the backend level rather than relying only on frontend visibility.

- Authentication is stateless and JWT-based.
- Passwords are hashed before being stored.
- Protected endpoints use the authenticated JWT principal to determine the current user.
- Administrative endpoints require `ROLE_ADMIN`.
- DTOs prevent sensitive persistence fields such as password hashes from being exposed through API responses.
- CORS is configured centrally and can be changed through environment/configuration rather than being hardcoded into individual controllers.
- Database credentials and JWT configuration are intended to be supplied through environment-specific configuration rather than committed secrets.

The latest configuration work explicitly removed hardcoded frontend origins, database credentials, and JWT settings from the source/configuration and moved them toward environment-based configuration. fileciteturn1file0

## 🧪 Testing

The backend includes integration tests covering important application and security flows, including:

- Successful registration and login.
- JWT issuance after authentication.
- Access to protected endpoints with a valid token.
- Rejection of duplicate registration attempts.
- Rejection of incorrect login credentials.
- Rejection of invalid JWTs.
- Role-based authorization, including denial of administrator endpoints to regular users.

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- **Java 21**
- **Node.js** and npm
- **MySQL**
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/GeoCheimon/GameStoreApp.git
cd GameStoreApp
```

### 2. Configure MySQL

Create a MySQL database for the application and provide the database connection values through the backend's environment/configuration.

The repository contains `schema.sql` and `data.sql` under `Backend/src/main/resources/` for database schema and initial data. fileciteturn15file0

> Do not commit real database credentials or JWT secrets to the repository.

### 3. Start the backend

From the `Backend` directory:

```bash
cd Backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd Backend
mvnw.cmd spring-boot:run
```

The backend is configured as a Spring Boot application using Java 21 and Maven. fileciteturn6file0

### 4. Configure the frontend

The frontend provides an example environment file containing the API base URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Create your local `.env` file from the example and adjust the API URL if necessary. fileciteturn11file0

### 5. Start the frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend's available scripts include development, production build, linting, and preview commands. fileciteturn4file0

Then open the local Vite development URL shown in the terminal.

## 🧩 Development Evolution

The repository history shows the application developing incrementally from a game catalogue into a more complete full-stack e-commerce platform.

### Phase 1 — Catalogue & UI

- Initial game catalogue and game cards.
- Category navigation and carousel.
- Game filtering.
- Backend integration with the game catalogue.

### Phase 2 — Advanced Catalogue Features

- Dynamic price filtering.
- Multi-category filtering.
- Discount support.
- Sorting by price, title, and discount.
- Search suggestions and direct game/category navigation.
- DTO-based game API responses.

### Phase 3 — Authentication

- Spring Security integration.
- User registration and login.
- BCrypt password hashing.
- JWT authentication.
- Frontend authentication context and persistent login state.

### Phase 4 — E-commerce & User Profile

- Wishlist.
- Shopping cart.
- Checkout workflow.
- Game library.
- Transaction history.
- Password management.
- Nested profile routing.

### Phase 5 — Administration & Hardening

- Role-based access control.
- User management.
- Game catalogue CRUD.
- Library moderation.
- Integration tests for security-critical flows.
- Environment-based database, CORS, API, and JWT configuration.

This progression is reflected in the repository's commit history, including dedicated authentication, e-commerce, search/filtering, testing, and configuration changes. fileciteturn1file0

## 📌 Current Scope

GameStoreApp is currently a locally runnable full-stack application. It provides the core functionality expected from a small digital game storefront, including catalogue discovery, authentication, purchasing workflow, personal game ownership, transaction history, and administrative management.

The project is primarily intended as a software development project demonstrating full-stack web development, REST API design, relational data modelling, authentication/authorization, frontend state management, and separation of application concerns.

## 📄 License

No license has currently been specified for this repository.