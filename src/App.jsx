import { Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from './pages/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/cart';
import AdminPanel from "./components/AdminPanel";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}