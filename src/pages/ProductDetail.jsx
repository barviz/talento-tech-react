import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://api.escuelajs.co/api/v1/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!product) return <p>No se encontró el producto</p>;

  return (
    <div style={{ padding: '1rem' }}>
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
    </div>
  );
};

export default ProductDetail;
