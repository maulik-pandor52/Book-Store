# Modern React Frontend

This frontend redesign keeps the existing Spring Boot routes unchanged. Run Spring Boot on `localhost:8080`, then run this React app on `localhost:5173`.

## Setup

```bash
cd bookstore/frontend
npm install
npm run dev
```

## Tailwind Setup Used

- `tailwind.config.js`
- `postcss.config.js`
- `src/index.css`

## Backend Compatibility

The UI keeps existing backend route names:

- Login: `POST /login`
- Register: `POST /register`
- OTP: `POST /verify-otp`
- Add product: `POST /save`
- Add to cart: `/cart/{id}`
- Checkout: `/checkout`

The product/order/admin data in this React frontend is demo UI data because the current backend does not expose JSON APIs for books, orders, users, or analytics.
