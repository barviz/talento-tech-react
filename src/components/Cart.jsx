import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PageWrapper = styled.div`
  background-color: #f1f3f5;
  padding: 2rem 1rem;
  min-height: 100vh;
`;

const StyledCartItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
  list-style: none;
  background-color: #f1f3f5;
`;

const StyledTitle = styled.h2`
  text-align: center;
  margin-top: 5rem;
  margin-bottom: 2rem;
  font-weight: bold;
`;

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.info('Producto eliminado del carrito');
  };

  const handleClear = () => {
    clearCart();
    toast.warn('Carrito vaciado');
  };

  if (!user) {
    return <p style={{ marginTop: '4rem' }}>Por favor inicia sesión para ver tu carrito.</p>;
  }

  return (
    <PageWrapper>
      <Container style={{ maxWidth: '1200px' }}>
        <Helmet>
          <title>Carrito | Mi Tienda</title>
          <meta name="description" content="Carrito de compras personalizado para cada usuario." />
        </Helmet>

        <Container className="mt-3">
          <StyledTitle>🛒 Carrito de {user.name}</StyledTitle>

          {cart.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <>
              <ul className="p-0">
                {cart.map((item) => (
                  <StyledCartItem key={item.id}>
                    <Image src={item.images[0]} alt={item.title} width="100" className="me-3" rounded />

                    <div className="flex-grow-1">
                      <strong>{item.title}</strong><br />
                      ${item.price} x {item.quantity} = ${item.price * item.quantity}
                    </div>

                    <div className="d-flex align-items-center gap-2" role="group" aria-label="Controles de cantidad">
                      <Button variant="success" onClick={() => increaseQuantity(item.id)} aria-label="Aumentar cantidad">
                        <FaPlus />
                      </Button>

                      <span aria-label={`Cantidad actual: ${item.quantity}`}>{item.quantity}</span>

                      <Button variant="warning" onClick={() => decreaseQuantity(item.id)} aria-label="Disminuir cantidad">
                        <FaMinus />
                      </Button>

                      <Button variant="danger" onClick={() => handleRemove(item.id)} aria-label="Eliminar producto">
                        <FaTrash />
                      </Button>
                    </div>
                  </StyledCartItem>
                ))}
              </ul>

              <div className="mt-4">
                <p><strong>Total: ${totalPrice}</strong></p>
                <Button variant="danger" onClick={handleClear} aria-label="Vaciar carrito">
                  Vaciar Carrito
                </Button>
              </div>
            </>
          )}
        </Container>
      </Container>
    </PageWrapper>
  );
};

export default Cart;
