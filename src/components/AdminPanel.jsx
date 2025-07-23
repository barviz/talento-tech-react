import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Container, Row, Col, Form, Button, Modal, Image, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaEye } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import 'react-toastify/dist/ReactToastify.css';
import { Table } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import { useNavigate } from 'react-router-dom';

const FormWrapper = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const Thumbnail = styled(Image)`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const PageWrapper = styled.div`
  background-color: #f1f3f5;
  padding: 2rem 1rem;
  min-height: 100vh;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  height: 100%;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
`;

const StyledFormTitle = styled.h3`
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const ContainerWrapper = styled.div`
  width: 80%;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const StyledTitle = styled.h2`
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
  font-weight: bold;
`;

const AdminPanel = () => {

  // Estados
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    title: '', name: '', price: 0, description: '',
    images: [],
    category: { id: 1, name: 'Clothes', image: 'https://placeimg.com/640/480/tech' },
    slug: 'clothes'
  });
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const navigate = useNavigate();

  const MOCK_API_URL = 'https://687efe16efe65e52008812b3.mockapi.io/ecc-bv/api/v1/productos';

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

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

  // Fetch productos
  useEffect(() => { fetchProducts(); }, []);
  const fetchProducts = async () => {
    setLoading(true); setApiError(null);
    try {
      const res = await axios.get(MOCK_API_URL);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      setApiError('Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  };

  // Notificaciones
  const notifySuccess = msg => toast.success(msg);
  const notifyError = msg => toast.error(msg);

  // Cambios en formulario
  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === 'categoryId' || name === 'categoryName') {
      setProductData(prev => ({
        ...prev,
        category: {
          ...prev.category,
          [name === 'categoryId' ? 'id' : 'name']:
            name === 'categoryId' ? parseInt(value) : value
        }
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || 0 : value
      }));
      if (name === 'title') {
        const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        setProductData(prev => ({ ...prev, slug, name: value }));
      }
    }
  };

  // Validaciones
  const validateForm = () => {
    const newErrors = {};
    if (!productData.title.trim()) newErrors.title = 'Título obligatorio';
    if (productData.price <= 0) newErrors.price = 'Precio debe ser > 0';
    if (productData.description.length < 10)
      newErrors.description = 'Mínimo 10 caracteres';
    if (!productData.slug.trim()) newErrors.slug = 'Slug obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envío de formulario (crear/editar)
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return notifyError('Corrige errores en el formulario');
    try {
      if (isEditing) {
        await axios.put(`${MOCK_API_URL}/${editingId}`, { ...productData, updatedAt: new Date().toISOString() });
        notifySuccess('Producto actualizado!');
      } else {
        await axios.post(MOCK_API_URL, { ...productData, creationAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        notifySuccess('Producto creado!');
      }
      await fetchProducts();
      resetForm();
    } catch (err) {
      notifyError(`Error: ${err.message}`);
    }
  };

  // Reinicio de formulario
  const resetForm = () => {
    setProductData({
      title: '', name: '', price: 0, description: '',
      img: '',
      images: [],
      category: { id: 1, name: 'Clothes', image: 'https://placeimg.com/640/480/tech' },
      slug: ''
    });
    setCurrentImageUrl('');
    setIsEditing(false);
    setEditingId(null);
  };

  // Edicon de producto existente
  const handleEdit = product => {
    setIsEditing(true);
    setEditingId(product.id);
    setProductData({
      title: product.title, price: product.price, description: product.description,
      images: product.images,
      category: product.category || { id: 1, name: 'Electrónica', image: 'https://placeimg.com/640/480/tech' },
      slug: product.slug
    });
  };

  const cancelEdit = () => resetForm();

  // Eliminar con confirmación
  const handleDelete = id => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${MOCK_API_URL}/${productToDelete}`);
      fetchProducts();
      notifySuccess('Producto eliminado!');
    } catch (err) {
      notifyError(`Error al eliminar: ${err.message}`);
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  // Manejo de imágenes
  const isValidUrl = url => {
    try { new URL(url); return true; }
    catch { return false; }
  };
  const addImage = () => {
    if (currentImageUrl.trim() && isValidUrl(currentImageUrl)) {
      setProductData(prev => ({
        ...prev,
        images: [...prev.images, currentImageUrl]
      }));
      setCurrentImageUrl('');
    } else notifyError('URL de imagen no válida');
  };
  const removeImage = i => {
    setProductData(prev => {
      const imgs = [...prev.images];
      imgs.splice(i, 1);
      return { ...prev, images: imgs };
    });
  };

  return (
    <PageWrapper>
      <Container style={{ maxWidth: '1200px' }}>
        <Helmet>
          <title>Admin Panel - Gestión de Productos</title>
          <meta name="description" content="Panel para administrar productos con React, Bootstrap, accesibilidad y SEO" />
        </Helmet>
        <ToastContainer position="top-right" autoClose={3000} />

        <StyledTitle>Panel de Administración</StyledTitle>
        <Row className="align-items-start justify-content-center">

          <Col md={6} className="d-flex flex-column align-items-stretch">

            <FormWrapper>
              <StyledFormTitle>{isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}</StyledFormTitle>
              <Form onSubmit={handleSubmit} aria-label="Formulario de producto">

                <Form.Group controlId="title">
                  <Form.Label>Título</Form.Label>
                  <Form.Control name="title" type="text" value={productData.title} onChange={handleInputChange}
                    isInvalid={!!errors.title} aria-required="true" aria-invalid={!!errors.title} />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="price">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control name="price" type="number" step="0.01" min="0"
                    value={productData.price} onChange={handleInputChange}
                    isInvalid={!!errors.price} aria-required="true" aria-invalid={!!errors.price} />
                  <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="description">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control as="textarea" name="description" value={productData.description} onChange={handleInputChange}
                    isInvalid={!!errors.description} aria-required="true" aria-invalid={!!errors.description} />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="slug">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control name="slug" type="text" value={productData.slug} onChange={handleInputChange}
                    isInvalid={!!errors.slug} aria-required="true" aria-invalid={!!errors.slug} />
                  <Form.Control.Feedback type="invalid">{errors.slug}</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group controlId="categoryId">
                      <Form.Label>ID Categoría</Form.Label>
                      <Form.Control name="categoryId" type="number" value={productData.category.id} onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="categoryName">
                      <Form.Label>Nombre Categoría</Form.Label>
                      <Form.Control name="categoryName" type="text" value={productData.category.name} onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="img">
                  <Form.Label>Imagen principal (URL)</Form.Label>
                  <Form.Control
                    name="img"
                    type="url"
                    placeholder="https://..."
                    value={productData.img}
                    onChange={handleInputChange}
                    isInvalid={!!errors.img}
                    aria-required="true"
                    aria-invalid={!!errors.img}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.img}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Imágenes (URLs)</Form.Label>
                  <InputGroup>
                    <FormControl
                      type="url"
                      placeholder="https://..."
                      value={currentImageUrl}
                      onChange={e => setCurrentImageUrl(e.target.value)}
                      aria-label="URL de imagen"
                    />
                    <Button
                      variant="secondary"
                      onClick={addImage}
                      aria-label="Agregar imagen"
                      style={{ backgroundColor: '#27b451ff', color: '#fff' }}
                    >
                      <FaPlus />
                    </Button>
                  </InputGroup>
                  <div className="d-flex flex-wrap mt-2">
                    {productData.images.map((img, i) => (
                      <div key={i} className="position-relative me-2 mb-2">
                        <Thumbnail src={img} alt={`Imagen ${i + 1}`} rounded />
                        <Button
                          variant="danger"
                          size="sm"
                          aria-label={`Eliminar imagen ${i + 1}`}
                          className="position-absolute top-0 end-0 p-1"
                          onClick={() => removeImage(i)}
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <Button type="submit" variant="primary" style={{ backgroundColor: '#27b451ff', color: '#fff' }} aria-label={isEditing ? 'Actualizar producto' : 'Agregar producto'}>
                  {isEditing ? <><FaEdit /> Actualizar</> : <><FaPlus /> Agregar</>}
                </Button>
                {isEditing && <Button variant="outline-secondary" className="ms-2" onClick={cancelEdit} aria-label="Cancelar edición">Cancelar</Button>}
              </Form>
            </FormWrapper>
          </Col>

          <ContainerWrapper>
            <StyledFormTitle>📦 Lista de Productos</StyledFormTitle>

            {loading ? (
              <p>Cargando...</p>
            ) : apiError ? (
              <p className="text-danger text-center">{apiError}</p>
            ) : (
              <>
                <div className="table-responsive">
                  <Table striped bordered hover responsive style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '20%', textAlign: 'center' }}>Imagen</th>
                        <th style={{ width: '20%', textAlign: 'center' }}>Título</th>
                        <th style={{ width: '20%', textAlign: 'center' }}>Precio</th>
                        <th style={{ width: '20%', textAlign: 'center' }}>Categoría</th>
                        <th style={{ width: '20%', textAlign: 'center' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map(product => (
                        <tr key={product.id}>
                          <td style={{ width: '20%', textAlign: 'center' }}>
                            <img
                              src={product.img || 'https://placehold.co/80x80'}
                              alt={product.title}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '0.5rem',
                                border: '1px solid #ccc'
                              }}
                            />
                          </td>
                          <td style={{ width: '20%', textAlign: 'center' }}>{product.title}</td>
                          <td style={{ width: '20%', textAlign: 'center' }}>${product.price}</td>
                          <td style={{ width: '20%', textAlign: 'center' }}>{product.category?.name}</td>
                          <td style={{ width: '20%', textAlign: 'center' }}>
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => navigate(`/producto/${product.id}`)}
                              className="me-2"
                              style={{ backgroundColor: '#f77824ff', color: '#fff' }}
                            >
                              <FaEye />
                            </Button>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="me-2"
                              style={{ backgroundColor: '#0d6efd', color: '#fff' }}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              style={{ backgroundColor: '#dc3545', color: '#fff' }}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <Pagination className="justify-content-center mt-3">
                    {renderPaginationItems()}
                  </Pagination>
                )}
              </>
            )}
          </ContainerWrapper>

        </Row>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header>
            <Modal.Title className="text-danger"><FaTrash className="me-2" />Eliminar Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Estás seguro de que querés eliminar este producto?</p>
            <p className="text-muted">Esta acción no se puede deshacer.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </PageWrapper>
  );
};

export default AdminPanel;
