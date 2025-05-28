import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
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
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        <Link to="/">Inicio</Link> |{' '}
        <Link to="/cart">Carrito</Link> |{' '}
        <Link to="/fav">Favs</Link> |{' '}
        <Link to="/login">Login</Link>
      </nav>

      <div style={{ padding: '1rem', marginTop: '4rem' }}>
        {children}
      </div>
    </>
  );
};

export default Layout;
