import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FaCartPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`https://687efe16efe65e52008812b3.mockapi.io/ecc-bv/api/v1/productos/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('❌ Error al cargar productos');
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`🛒 "${product.title}" agregado al carrito`);
  };

  if (loading) return <p>Cargando...</p>;
  if (!product) return <p>No se encontró el producto</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h2>{product.title}</h2>
      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>Descripción:</strong> {product.description}</p>

      <div style={{ margin: '1rem 0' }}>
        <strong>Imágenes del producto:</strong>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          {product.images.map((img, idx) => (
            <img key={idx} src={img} alt={`${product.title} ${idx + 1}`} width="150" />
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Categoría:</strong>
        <span> {product.category.name}</span>
      </div>

      <p style={{ marginTop: '1rem' }}>
        <strong>Publicado:</strong> {new Date(product.creationAt).toLocaleDateString()}
      </p>

      <div style={{ marginTop: '2rem' }}>
        <Button
          variant="success"
          onClick={handleAddToCart}
          aria-label={`Agregar ${product.title} al carrito`}
        >
          <FaCartPlus className="me-2" />
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
