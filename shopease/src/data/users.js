// Demo accounts. They work without registering.
// NOTE: Real websites NEVER store plain-text passwords. This is only a demo
// of the login flow, with everything kept in the browser's localStorage.

export const demoUsers = [
  {
    id: "user-admin",
    name: "Demo Admin",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin",
  },
  {
    id: "user-customer",
    name: "Demo Customer",
    email: "user@example.com",
    password: "User123!",
    role: "customer",
  },
];
