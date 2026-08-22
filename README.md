# MarketHub - CA 02 Working Build

This starter implements a practical interim version of the proposed **MarketHub Multi-Vendor E-Commerce Marketplace**.

## Included for CA 02 evidence

- React + Vite + Tailwind CSS frontend
- Node.js + Express REST API
- MongoDB + Mongoose
- Customer/Vendor registration and login
- JWT authentication and bcrypt password hashing
- Product listing and product details
- Vendor product CRUD
- Shopping cart using localStorage
- Basic order creation, order history and delivery status
- Product reviews and 1–5 star ratings
- Review edit/delete for the review owner
- Average product rating and review count
- Seed script for demo users/products
- Postman-friendly REST endpoints

## 1. Requirements

Use a recent Node.js version. Current React Router v8 uses a modern Node baseline, so Node 22+ is recommended.

You also need either:
- MongoDB Community Server locally, or
- a MongoDB Atlas connection string.

## 2. Backend setup

Open a terminal:

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and update values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/markethub
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Seed demo data:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend:
`http://localhost:5000`

## 3. Frontend setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend:
`http://localhost:5173`

## Demo accounts after seeding

Vendor:
- Email: `vendor@markethub.lk`
- Password: `Vendor123!`

Customer:
- Email: `customer@markethub.lk`
- Password: `Customer123!`

## Useful API endpoints for Postman screenshots

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` — vendor/admin
- `PUT /api/products/:id` — owner/admin
- `DELETE /api/products/:id` — owner/admin

### Orders
- `POST /api/orders`
- `GET /api/orders/my`

### Reviews
- `GET /api/reviews/product/:productId`
- `POST /api/reviews` — customer
- `PUT /api/reviews/:id` — review owner
- `DELETE /api/reviews/:id` — review owner/admin

### Health
- `GET /api/health`

## Suggested CA 02 screenshots

1. Home page
2. Register page
3. Login page
4. Product listing
5. Product details
6. Shopping cart
7. Vendor product management
8. MongoDB `users` collection
9. MongoDB `products` collection
10. Successful login API response in Postman
11. Product CRUD API response in Postman
12. Customer order history / tracking

## Notes for final project

This is an interim build. For the final multi-vendor version, improve:
- per-vendor sub-orders and delivery status
- Stripe payment processing
- Cloudinary uploads
- reviews/ratings
- Socket.io notifications
- Nodemailer email notifications
- admin analytics
- AI recommendations
