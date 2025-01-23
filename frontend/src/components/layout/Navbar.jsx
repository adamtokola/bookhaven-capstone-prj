import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            BookStore
          </Link>
          
          <div className="flex gap-4">
            <Link to="/books" className="hover:text-gray-300">
              Books
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className="hover:text-gray-300">
                  Profile
                </Link>
                <button 
                  onClick={logout}
                  className="hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link to="/register" className="hover:text-gray-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
