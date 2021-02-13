import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listProducts, deleteProductAction } from "../actions/productAction";
import { PRODUCT_CREATE_RESET } from "../constants/constants";
import Paginate from "../components/Paginate";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductListScreen = ({ history, match }) => {
  const [imageDeleteSuccess, setImageDeleteSuccess] = useState(false);
  const dispatch = useDispatch();

  const pageNumber = match.params.pageNumber || 1;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productList = useSelector((state) => state.productList);
  const { products, loading, error, pages, page } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    product: createdProduct,
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = productCreate;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete,
  } = productDelete;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo.isAdmin) {
      history.push("/");
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteUserHandler = (id, imageId) => {
    if (window.confirm("Are you sure? User will be permanently deleted")) {
      axios
        .post(
          `/api/upload/removeimage`,
          { imageId },
          {
            headers: { "x-auth-token": userInfo.token },
          }
        )
        .then(() => console.log("operation success"))
        .catch((error) => console.log(error));
      dispatch(deleteProductAction(id));
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Link to="/admin/productcreate" className="my-3 btn btn-primary">
            <i className="fas fa-plus"></i>Create Products
          </Link>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped hover bordered responsive className="btn-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() =>
                        deleteUserHandler(product._id, product.image.public_id)
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
