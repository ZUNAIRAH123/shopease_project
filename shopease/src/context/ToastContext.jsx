import { createContext, useContext, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

// Toast notifications: small messages that appear for 3 seconds.
// Use it anywhere with:  const { showToast } = useToast();  showToast("Saved!", "success");

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function removeToast(id) {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }

  function showToast(message, type = "success") {
    const id = Date.now() + Math.random();
    const newToast = { id: id, message: message, type: type };
    setToasts((currentToasts) => [...currentToasts, newToast]);

    // Hide it automatically after 3 seconds
    setTimeout(() => removeToast(id), 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed right-4 top-20 z-50 flex w-72 flex-col gap-2 sm:w-80">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={
              "flex items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg " +
              (toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-green-200 bg-green-50 text-green-800")
            }
          >
            {toast.type === "error" ? (
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle size={18} className="mt-0.5 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} aria-label="Close message">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
