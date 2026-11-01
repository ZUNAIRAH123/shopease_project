import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page-container flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-bold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-6">Go to home page</Link>
    </div>
  );
}

export default NotFound;
