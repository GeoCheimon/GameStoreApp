# GameStoreApp

A full-stack game store web application built with **React + TypeScript** on the frontend and **Spring Boot + MySQL** on the backend.

The project evolved from a simple game catalogue into a complete e-commerce-style platform with game discovery, filtering and search, user authentication, wishlist and cart management, game ownership, transaction history, and an administrator panel.

## Features

- Game Catalogue: Browse hundreds of game titles with detailed information, including price, category, and release date.
- Search & Filters: Quickly find games by title, genre (RPG, Action, etc.), and platform.
- Shopping Cart: Add, remove, and manage products before checkout.
- User System: User registration and login with secure data storage.
- Admin Panel: Administrators can add new titles, edit prices, and delete games.

### Game Choosing

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

### Authentication & Authorization

- User registration and login.
- Stateless authentication using **JWT**.
- Passwords stored using secure password hashing with Spring Security's password encoder.
- JWT-based session persistence on the frontend.
- Global authentication state using React Context.
- Role-based authorization with:
  - `ROLE_USER`
  - `ROLE_ADMIN`
- Protected backend endpoints and administrator-only operations.

### E-commerce Flow

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

### User Profile

The profile area uses nested React Router routes and provides separate sections for:

- Account details
- Password change
- Wishlist
- Shopping cart
- Owned games / library
- Transaction history

The UI is role-aware, showing user-specific functionality to regular users and administrative functionality to administrators.

### Admin Panel

Administrators have access to a dedicated management interface with:

- View all registered users.
- Delete user accounts.
- Manage the global game catalogue.
- Create new games.
- Update existing games through inline editing.
- Delete games.
- Revoke a specific game from a user's library.

All `/api/admin/**` operations are protected by role-based authorization on the backend.

## Architecture

The backend is organized into separate layers for controllers, services, repositories, entities/models, DTOs, security, and configuration. The project also uses DTOs to define stable API response/request contracts instead of exposing persistence entities directly.

## Technology Stack

### Frontend

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **Bootstrap**
- **jwt-decode**

The frontend is implemented as a Single-Page Application with nested routing for the profile area and centralized authentication state through React Context.

### Backend

- **Java 21**
- **Spring Boot 3.5.5**
- **Spring Web**
- **Spring Data JPA / Hibernate**
- **Spring Security**
- **JWT**
- **MySQL**
- **Maven**
- **Lombok**

The backend uses Spring Boot's layered application structure and includes dedicated controllers, services, repositories, DTOs, models, configuration, and security packages.

## REST APIs

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

The API was refactored to use DTOs for game responses and search suggestions, while keeping authentication and administrative functionality protected through Spring Security. The controller layer currently includes dedicated controllers for authentication, games, users, wishlist, cart, library, transactions, and administration.

## Purchase Flow

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

## Security Design

Security is implemented at the backend level rather than relying only on frontend visibility.

- Authentication is stateless and JWT-based.
- Passwords are hashed before being stored.
- Protected endpoints use the authenticated JWT principal to determine the current user.
- Administrative endpoints require `ROLE_ADMIN`.
- DTOs prevent sensitive persistence fields such as password hashes from being exposed through API responses.
- CORS is configured centrally and can be changed through environment/configuration rather than being hardcoded into individual controllers.
- Database credentials and JWT configuration are intended to be supplied through environment-specific configuration rather than committed secrets.

The latest configuration work explicitly removed hardcoded frontend origins, database credentials, and JWT settings from the source/configuration and moved them toward environment-based configuration.

## Integration Testing

The backend includes integration tests covering important application and security flows, including:

- Successful registration and login.
- JWT issuance after authentication.
- Access to protected endpoints with a valid token.
- Rejection of duplicate registration attempts.
- Rejection of incorrect login credentials.
- Rejection of invalid JWTs.
- Role-based authorization, including denial of administrator endpoints to regular users.
