import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          background: '#eee',
          zIndex: 1000,
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <Link to="/" style={{ marginRight: '1rem' }}>Inicio</Link>
          <Link to="/cart" style={{ marginRight: '1rem' }}>Carrito</Link>
          <Link to="/dashboard" style={{ marginRight: '1rem' }}>Panel</Link>
        </div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '1rem' }}>Hola, {user.name}</span>
              <button
                onClick={logout}
                style={{
                  padding: '5px 10px',
                  background: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <div style={{ marginTop: '65px' }}>
        {children}
      </div>
    </>
  );
};

export default Layout;