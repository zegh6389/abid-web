# Margin Kidz E-Commerce Platform

## Project Overview

This is a full-stack e-commerce application built with Next.js, Prisma, and Tailwind CSS. It is designed to be a modern, fast, and user-friendly online store. The application features a customer-facing front-end for browsing products, adding them to the cart, and completing the checkout process. It also includes an admin panel for managing products, orders, and other aspects of the store. The application is integrated with AWS S3 for media storage and Stripe for secure payments.

## Tech Stack

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **ORM:** Prisma
*   **Database:** PostgreSQL
*   **Payments:** Stripe
*   **File Storage:** AWS S3
*   **Validation:** Zod
*   **UI Components:** Headless UI, Framer Motion
*   **Linting:** ESLint
*   **Type Checking:** TypeScript

## Features

*   **Customer-Facing Store:**
    *   Product listing and filtering
    *   Product details page
    *   Shopping cart
    *   Checkout with Stripe integration
    *   User accounts and order history
    *   Wishlist
*   **Admin Panel:**
    *   Dashboard with an overview of sales and orders
    *   Product management (create, edit, delete)
    *   Order management (view, update status)
    *   Media management with S3 integration
*   **Authentication:**
    *   Password-based authentication for admins
*   **Database:**
    *   PostgreSQL database with a well-defined schema
    *   Prisma for database access and migrations

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up the database:**
    *   Make sure you have PostgreSQL installed and running.
    *   Create a new database.
    *   Copy the `.env.example` file to `.env` and update the `DATABASE_URL` with your database connection string.
    *   Run the database migrations:
        ```bash
        npx prisma migrate dev
        ```
    *   Seed the database with initial data:
        ```bash
        npx prisma db seed
        ```

## Environment Variables

To run the application, you need to create a `.env` file in the root of the project and add the following environment variables:

*   `DATABASE_URL`: The connection string for your PostgreSQL database.
*   `AWS_REGION`: The AWS region where your S3 bucket is located.
*   `AWS_S3_BUCKET`: The name of your AWS S3 bucket for media storage.
*   `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
*   `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
*   `NEXT_PUBLIC_BASE_URL`: The base URL of your application. For local development, this is `http://localhost:3000`.
*   `ADMIN_EMAIL`: The email for the initial admin user, used by the seed script.
*   `ADMIN_PASSWORD`: The password for the initial admin user, used by the seed script.

You can use the `.env.example` file as a template:

```bash
# .env

# Database (Amazon RDS PostgreSQL or Aurora Serverless v2)
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/DBNAME?sslmode=require&connection_limit=5&pgbouncer=true" # For AWS RDS, sslmode=require is recommended

# AWS S3 for media
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""

# Next.js
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Admin bootstrap (optional; used by seed script to create an admin user)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

## Running the Application

*   **Development Mode:**
    To run the application in development mode with hot-reloading, use the following command:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

*   **Production Mode:**
    To build the application for production, use the following command:
    ```bash
    npm run build
    ```
    To start the production server, use the following command:
    ```bash
    npm run start
    ```
    The application will be available at `http://localhost:3000`.

## API Endpoints

The application exposes several API endpoints for various functionalities. Here are some of the main ones:

*   `/api/admin/products`: For creating, updating, and deleting products.
*   `/api/admin/orders`: For managing orders.
*   `/api/cart`: For managing the shopping cart.
*   `/api/checkout`: For processing payments with Stripe.
*   `/api/products`: For fetching product data.
*   `/api/uploads`: For handling file uploads to AWS S3.
*   `/api/auth/login`: For admin login.
*   `/api/auth/logout`: For admin logout.

## Database Schema

The database schema is defined using Prisma. Here are the main models:

*   **User:** Stores user information, including email, password (hashed), and role.
*   **Product:** Stores product details, such as title, description, and price.
*   **Variant:** Represents a specific version of a product (e.g., by size or color).
*   **Media:** Stores URLs for product images and videos, linked to S3.
*   **Inventory:** Tracks stock levels for each product variant.
*   **Collection:** Allows grouping products into collections.
*   **Order:** Stores information about customer orders.
*   **OrderItem:** Represents an item within an order.
*   **Payment:** Stores payment details for each order.

The relationships between these models are defined in the `prisma/schema.prisma` file. For example, a `Product` can have multiple `Variant`s, and an `Order` can have multiple `OrderItem`s.

## Deployment

The application is a standard Next.js project and can be deployed to any platform that supports Node.js, such as Vercel, Netlify, or AWS.

**Vercel:**

Vercel is the recommended platform for deploying Next.js applications. To deploy to Vercel, you can connect your Git repository to your Vercel account. Vercel will automatically detect that it's a Next.js project and configure the build settings.

The `vercel-build` script in `package.json` is provided for Vercel deployments. It runs `prisma generate` before building the Next.js application.

**Other Platforms:**

When deploying to other platforms, you'll need to:

1.  Set up a Node.js environment.
2.  Install the dependencies with `npm install`.
3.  Set up the environment variables.
4.  Run the database migrations with `npx prisma migrate deploy`.
5.  Build the application with `npm run build`.
6.  Start the application with `npm run start`.

## Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the code using ESLint.
*   `npm run typecheck`: Checks for TypeScript errors.
*   `npm run prisma:generate`: Generates the Prisma client.
*   `npm run prisma:migrate`: Creates and applies database migrations.
*   `npm run prisma:studio`: Opens the Prisma Studio to view and edit data.
*   `npm run db:push`: Pushes the Prisma schema to the database without creating a migration.
*   `npm run seed`: Seeds the database with initial data.
*   `npm run vercel-build`: A script specifically for Vercel deployments.
*   `npm run db:test`: Tests the database connection.
*   `npm run db:create`: Creates the database.
*   `npm run db:migrate`: Applies database migrations in a production environment.
*   `npm run db:seed`: Seeds the database.
*   `npm run s3:test`: Tests the S3 connection.
*   `npm run s3:put`: Tests putting a file in the S3 bucket.
*   `npm run aws:whoami`: Tests AWS STS credentials.
*   `npm run presign:test`: Tests generating a presigned URL for S3.
*   `npm run presign:test:local`: Tests generating a presigned URL for a local S3-compatible service.
*   `npm run ping`: A simple script to check if the server is running.
