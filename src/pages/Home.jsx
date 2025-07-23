import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import 'react-toastify/dist/ReactToastify.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('https://687efe16efe65e52008812b3.mockapi.io/ecc-bv/api/v1/productos')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('❌ Error al cargar productos');
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`🛒 "${product.title}" agregado al carrito`);
  };

  // Filtro de búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <>
      <Helmet>
        <title>Home | Tienda React</title>
        <meta name="description" content="Listado de productos disponibles en la tienda." />
      </Helmet>

      <ToastContainer position="top-right" autoClose={3000} />

      <Container className="mt-4">
        <Form.Control
          type="text"
          placeholder="🔎 Buscar por nombre o categoría..."
          className="mb-4"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            <ProductList products={currentProducts} onAddToCart={handleAddToCart} />
            {totalPages > 1 && (
              <Pagination className="justify-content-center mt-4">
                {renderPaginationItems()}
              </Pagination>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Home;
