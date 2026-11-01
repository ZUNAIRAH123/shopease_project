import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { validateSignup } from "../utils/validation";

function Signup() {
  const { user, signup, emailExists } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user !== null) {
    return <Navigate to="/" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validateSignup(form);

    // Email uniqueness check (only if the email format is already valid)
    if (!newErrors.email && emailExists(form.email)) {
      newErrors.email = "An account with this email already exists";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const result = signup(form.name, form.email, form.password);
      if (result.success) {
        showToast("Account created! Please log in.");
        navigate("/login", { replace: true });
      } else {
        setErrors({ email: result.message });
        setSubmitting(false);
      }
    }, 500);
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="mt-1 text-sm text-gray-500">Sign up to place orders and track them.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "input input-error" : "input"}
              placeholder="Jane Doe"
              autoComplete="name"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

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
                placeholder="At least 8 characters"
                autoComplete="new-password"
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

          <div>
            <label className="label" htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input input-error" : "input"}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating account...
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
