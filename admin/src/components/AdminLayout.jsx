import { Link, Outlet, useNavigate } from 'react-router-dom';
import { setToken } from '../api';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Friends of the Forest - Admin
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <Link
              to="/"
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              to="/trails"
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Trails
            </Link>
            <Link
              to="/questions"
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Questions
            </Link>
            <Link
              to="/friends"
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Forest Friends
            </Link>
            <Link
              to="/zones"
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Zones
            </Link>
            <Link
              to="/users"
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Users
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
