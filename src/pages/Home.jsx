import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';

const Home = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://api.escuelajs.co/api/v1/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar productos');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <ProductList products={products} onAddToCart={onAddToCart} />
    </div>
  );
};

export default Home;
