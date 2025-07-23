import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (!email || !password) {
      return false;
    }

    let fakeUser;
    if (email === "admin@example.com" && password === "admin123") {
      fakeUser = {
        email,
        name: "Administrador",
        role: "admin"
      };
    } else if (email === "user@example.com" && password === "user123") {
      fakeUser = {
        email,
        name: "Usuario",
        role: "user"
      };
    } else {
      fakeUser = {
        email,
        name: email.split('@')[0] || 'Usuario',
        role: "user"
      };
    }

    localStorage.setItem('user', JSON.stringify(fakeUser));
    setUser(fakeUser);
    navigate('/');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};