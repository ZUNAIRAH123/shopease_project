import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { validateLogin } from "../utils/validation";

function Login() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Go home.
  if (user !== null && !submitting) {
    return <Navigate to="/" replace />;
  }

  // If the user was sent here from a protected page, go back there after login
  const returnTo = location.state && location.state.from ? location.state.from : null;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: undefined, form: undefined });
  }

  function fillDemo(email, password) {
    setForm({ email: email, password: password });
    setErrors({});
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validateLogin(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    // Short delay to simulate a server request
    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.success) {
        showToast("Welcome back, " + result.user.name + "!");
        if (returnTo) {
          navigate(returnTo, { replace: true });
        } else if (result.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        setErrors({ form: result.message });
        setSubmitting(false);
      }
    }, 500);
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Log in</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Please enter your details.</p>

        {errors.form && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input input-error" : "input"}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className={(errors.password ? "input input-error" : "input") + " pr-10"}
                placeholder="Your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Logging in...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Do not have an account?{" "}
          <Link to="/signup" className="font-medium text-primary-600 hover:underline">Sign up</Link>
        </p>

        {/* Demo accounts */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-xs text-gray-600">
          <p className="mb-2 font-semibold text-gray-700">Demo accounts (click to fill)</p>
          <button
            type="button"
            onClick={() => fillDemo("user@example.com", "User123!")}
            className="block text-left hover:text-primary-600"
          >
            Customer: user@example.com / User123!
          </button>
          <button
            type="button"
            onClick={() => fillDemo("admin@example.com", "Admin123!")}
            className="mt-1 block text-left hover:text-primary-600"
          >
            Admin: admin@example.com / Admin123!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
