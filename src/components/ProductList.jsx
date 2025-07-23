import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { FaCartPlus } from 'react-icons/fa';

const ProductTitle = styled.h2`
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
  font-weight: bold;
`;

const StyledCard = styled(Card)`
  margin-bottom: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StyledButton = styled(Button)`
  margin-top: auto;
`;

const ProductList = ({ products, onAddToCart }) => {
  return (
    <>
      <ProductTitle>🛍️ Productos Disponibles</ProductTitle>
      <Row>
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
            <StyledCard>
              <Link to={`/producto/${product.id}`}>
                <Card.Img
                  variant="top"
                  src={product.images[0]}
                  alt={product.title}
                  style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                />
              </Link>
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.category.name}</Card.Text>
                <Card.Text><strong>Precio:</strong> ${product.price}</Card.Text>
                <StyledButton
                  variant="success"
                  onClick={() => onAddToCart(product)}
                  aria-label={`Agregar ${product.title} al carrito`}
                >
                  <FaCartPlus className="me-2" />
                  Agregar al carrito
                </StyledButton>
              </Card.Body>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductList;
