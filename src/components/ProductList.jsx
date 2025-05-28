import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductList = ({ products, onAddToCart }) => {
  const [message, setMessage] = useState('');

  const handleAdd = (product) => {
    onAddToCart(product);
    setMessage(`🛒 Se agregó "${product.title}" al carrito`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      {message && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 9999
        }}>
          {message}
        </div>
      )}

      <h2>Productos</h2>
      {products.map((product) => (
        <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
          <Link to={`/product/${product.id}`}>
            <img
              src={product.images[0]}
              alt={product.title}
              width="150"
              style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}
            />
          </Link>
          <h3>{product.title}</h3>
          <p><strong>Precio:</strong> ${product.price}</p>
          <button onClick={() => handleAdd(product)}>Agregar al carrito 🛒</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
