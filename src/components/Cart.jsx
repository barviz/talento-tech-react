const Cart = ({ cart }) => {
  return (
    <div>
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cart.map((item, i) => (
            <li key={i} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
              <img src={item.images[0]} alt={item.title} width="100" style={{ marginRight: '1rem' }} />
              <div>
                <strong>{item.title}</strong><br />
                ${item.price}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
