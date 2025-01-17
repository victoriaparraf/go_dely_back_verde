<p align="center">
    <img src="https://i.imgur.com/TGDl5Ud.png" align="center" width="30%">
</p>
<p align="center"><h1 align="center">GODELY APP BACKEND</h1></p>
<p align="center">
    <p style="font-size: 24px; color: #006400;">❯ TEAM VERDE</p>
</p>
<p align="center">
    <img src="https://img.shields.io/github/license/victoriaparraf/go_dely_back_verde?style=default&logo=opensourceinitiative&logoColor=white&color=45b908" alt="license">
    <img src="https://img.shields.io/github/last-commit/victoriaparraf/go_dely_back_verde?style=default&logo=git&logoColor=white&color=45b908" alt="last-commit">
    <img src="https://img.shields.io/github/languages/top/victoriaparraf/go_dely_back_verde?style=default&color=45b908" alt="repo-top-language">
    <img src="https://img.shields.io/github/languages/count/victoriaparraf/go_dely_back_verde?style=default&color=45b908" alt="repo-language-count">
</p>
<p align="center"><!-- default option, no dependency badges. -->
</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>
<br>

##  Table of Contents

- [ Overview](#-overview)
- [ Features](#-features)
- [ Getting Started](#-getting-started)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)

---

##  Overview

<code>❯
GoDely backend is a server-side application built using the NestJS framework. It follows the principles of Domain-Driven Design (DDD) and Hexagonal Architecture to ensure a scalable, maintainable, and testable codebase.</code>

---

## :sparkles: Features

<code>❯ Auth Module</code>
- Secure endpoints with JWT-based authentication.
- Handle user login and registration.

<code>❯ Product Module</code>
- Manage products with CRUD operations.
- Associate products with categories and discounts.
- Handle product images and inventory.

<code>❯ Category Module</code>
- Organize products into categories.
- Manage category hierarchy and relationships.

<code>❯ Combo Module</code>
- Create and manage product combos.
- Associate combos with discounts and promotions.

<code>❯ Cupon Module</code>
- Generate and manage discount cupons.
- Apply cupons to orders for discounts.

<code>❯ Discount Module</code>
- Define and manage discounts for products and combos.
- Apply discounts to orders.

<code>❯ Notification Module</code>
- Manage notification tokens for users.
- Send notifications to users.

<code>❯ Order Module</code>
- Handle order creation, updates, and status changes.
- Manage order products and combos.

<code>❯ Payment Method Module</code>
- Manage different payment methods.
- Integrate with payment gateways.

<code>❯ User Module</code>
- Handle user registration, login, and profile management.
- Manage user roles and permissions.

<code>❯ Address Module</code>
- Handle user addresses, preferred address, and locations.

---

## 🛠 Technologies

<p>
    <img src="https://static-00.iconduck.com/assets.00/nestjs-icon-2048x2040-3rrvcej8.png" alt="NestJS" width="50" height="50"/>
    <img src="https://static-00.iconduck.com/assets.00/cloudinary-icon-512x335-z2n5aue3.png" alt="Cloudinary" width="50" height="50"/>
    <img src="https://static-00.iconduck.com/assets.00/postgresql-icon-1987x2048-v2fkmdaw.png" alt="PostgreSQL" width="50" height="50"/>
    <img src="https://static-00.iconduck.com/assets.00/rabbitmq-icon-484x512-s9lfaapn.png" alt="RabbitMQ" width="50" height="50"/>
</p>

---

## :construction: Getting Started

## Project setup

```bash
$ yarn install
```

## Database configuration

Clone file:
```bash
.env.template
``` 
And rename to:
```bash
.env
``` 
```bash
# docker
docker-compose up -d
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

---

## :page_facing_up: License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---

## :technologist: Authors and Contributions

### :bust_in_silhouette: Sofía Arasme    ![Sofía Arasme](https://github.com/sofiaarasme.png?size=50)

- Product Module
- Category Module
- Payment Method Module
- User Module
- Auth Module
- Order Module

### :bust_in_silhouette: Victoria Parra   ![Victoria Parra](https://github.com/victoriaparraf.png?size=50)

- Combo Module
- Discount Module
- Notification Module
- Images Module
- Order Module

### :bust_in_silhouette: Nicola Manfredi

- Address Module
- Cupon Module

---