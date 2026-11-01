# ShopEase - React E-Commerce Store

A complete, frontend-only online store built with React. There is no backend:
all data (users, products, cart, orders) is kept in the browser's `localStorage`.
The code is written to be simple and readable for beginners.

## Project overview

**Customers can:** browse products, search, filter by category and price, sort,
view product details, add to cart (limited by stock), register, log in, check out
(Cash on Delivery or a simulated card), see an order confirmation, and view their
order history with the latest status.

**Admins can:** see dashboard statistics, add / edit / delete products (with a
delete confirmation), update stock, price, category, description and image URL,
view all orders with customer details and items, and change order status
(Pending, Processing, Shipped, Delivered, Cancelled).

## Technologies used

- React 18 (functional components and hooks)
- Vite (dev server and build tool)
- JavaScript (no TypeScript)
- Tailwind CSS 3
- React Router DOM 6
- React Context API (shared state)
- Browser `localStorage` (persistence)
- Lucide React (icons)

## Requirements

- Node.js 18 or newer (https://nodejs.org)

## Install dependencies

Open the project folder in a terminal (VS Code PowerShell works) and run:

```powershell
npm install
```

## Run the project

```powershell
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

## Build the project

```powershell
npm run build
```

The production files are created in the `dist` folder. To preview that build:

```powershell
npm run preview
```

## Demo accounts

| Role     | Email               | Password    |
| -------- | ------------------- | ----------- |
| Customer | `user@example.com`  | `User123!`  |
| Admin    | `admin@example.com` | `Admin123!` |

Both work without registering. You can also create your own customer account on
the Sign up page (new accounts are always customers).

## How localStorage is used

All data is saved in your browser under these keys:

| Key                      | What it stores                                      |
| ------------------------ | --------------------------------------------------- |
| `shopease_users`         | Registered users (including the two demo accounts)  |
| `shopease_current_user`  | The logged-in user (name, email, role)              |
| `shopease_products`      | All products (admin changes are saved here)         |
| `shopease_cart`          | Cart: product ids and quantities                    |
| `shopease_orders`        | All orders placed by customers                      |

- The sample products and demo users are only used the **first time** the app
  runs. After that, the saved data is used, so refreshing never resets anything.
- To reset the whole store, open the browser DevTools -> Application ->
  Local Storage, and delete the keys above (or click "Clear all").
- Data lives in one browser only. A different browser or a private window starts fresh.

## Important folders

```
src/
  components/   Reusable pieces: Navbar, Footer, ProductCard, ProtectedRoute,
                AdminRoute, LoadingSpinner, ProductForm, StatusBadge, ...
  pages/        One file per page: Home, Products, ProductDetails, Cart, Login,
                Signup, Checkout, OrderConfirmation, MyOrders, Admin*, NotFound
  context/      Global state: AuthContext, ProductContext, CartContext,
                OrderContext, ToastContext
  data/         Starting data: products.js (14 sample products), users.js (demo accounts)
  utils/        storage.js (localStorage helpers), validation.js (form checks),
                format.js (prices, dates, shipping rules)
  App.jsx       Routes
  main.jsx      App entry point
  index.css     Tailwind setup and shared style classes (buttons, inputs, cards)
```

## Routes

| Path                          | Page                      | Access          |
| ----------------------------- | ------------------------- | --------------- |
| `/`                           | Home                      | Everyone        |
| `/products`                   | Product list with filters | Everyone        |
| `/products/:id`               | Product details           | Everyone        |
| `/cart`                       | Cart                      | Everyone        |
| `/login`, `/signup`           | Authentication            | Everyone        |
| `/checkout`                   | Checkout                  | Logged-in users |
| `/order-confirmation/:orderId`| Order confirmation        | Logged-in users |
| `/orders`                     | My order history          | Logged-in users |
| `/admin`                      | Dashboard                 | Admin only      |
| `/admin/products`             | Manage products           | Admin only      |
| `/admin/orders`               | Manage orders             | Admin only      |

Non-admin users who open an admin URL are redirected to the home page.

## Business rules worth knowing

- Shipping is $9.99, and free for orders of $100 or more (see `src/utils/format.js`).
- Placing an order reduces product stock. Cancelling an order (admin) returns the stock.
  A cancelled order cannot be changed again.
- "Total sales" on the dashboard counts every order except cancelled ones.
- Checkout requires login, so each order is linked to the customer's email.

## Limitations (this is a demo)

- **Not secure:** passwords are stored as plain text in localStorage and the admin check
  runs in the browser. Anyone can edit localStorage. A real shop needs a backend.
- **Card payments are simulated.** Nothing is charged; only the last 4 digits of the card
  are stored with the order.
- **Product images** are loaded from Unsplash URLs, so they need an internet connection.
  If an image fails to load, a grey "No image" placeholder is shown. The admin can paste any
  other image URL when editing a product.
- Data is stored per browser and is not shared between devices.
