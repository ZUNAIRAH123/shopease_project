import { createContext, useContext, useEffect, useState } from "react";
import { demoUsers } from "../data/users";
import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  removeFromStorage,
} from "../utils/storage";

// Handles registered users, login, signup and logout.

const AuthContext = createContext();

// Load users from localStorage. The first time (nothing saved yet) we start with the demo accounts.
function getInitialUsers() {
  const savedUsers = loadFromStorage(STORAGE_KEYS.users, null);
  if (savedUsers === null) {
    return demoUsers;
  }
  return savedUsers;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(getInitialUsers);
  // "user" is the currently logged-in user (or null)
  const [user, setUser] = useState(() => loadFromStorage(STORAGE_KEYS.currentUser, null));

  // Save to localStorage whenever the data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.users, users);
  }, [users]);

  useEffect(() => {
    if (user === null) {
      removeFromStorage(STORAGE_KEYS.currentUser);
    } else {
      saveToStorage(STORAGE_KEYS.currentUser, user);
    }
  }, [user]);

  function emailExists(email) {
    const emailToCheck = email.trim().toLowerCase();
    for (const savedUser of users) {
      if (savedUser.email.toLowerCase() === emailToCheck) {
        return true;
      }
    }
    return false;
  }

  // Returns { success: true, user } or { success: false, message }
  function login(email, password) {
    const emailToCheck = email.trim().toLowerCase();

    for (const savedUser of users) {
      if (savedUser.email.toLowerCase() === emailToCheck && savedUser.password === password) {
        // Do not keep the password in the "logged in user" object
        const loggedInUser = {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
        };
        setUser(loggedInUser);
        return { success: true, user: loggedInUser };
      }
    }

    return { success: false, message: "Incorrect email or password" };
  }

  // Creates a customer account. The person must log in afterwards.
  function signup(name, email, password) {
    if (emailExists(email)) {
      return { success: false, message: "An account with this email already exists" };
    }

    const newUser = {
      id: "user-" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: "customer",
    };
    setUsers([...users, newUser]);
    return { success: true };
  }

  function logout() {
    setUser(null);
  }

  const isAdmin = user !== null && user.role === "admin";

  const value = { user, isAdmin, login, signup, logout, emailExists };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
