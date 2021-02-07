import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import FileUpload from "../components/FileUpload";
import { createProductAction } from "../actions/productAction";

const ProductCreateScreen = ({ match, history }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState({});
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error } = productCreate;

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      createProductAction({
        image,
        description,
        name,
        category,
        brand,
        countInStock,
        price,
      })
    );

    history.push("/");
  };
  return (
    <>
      <Link to="/admin/productlist">Go back</Link>
      <FormContainer>
        <h1>Create Product</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <FileUpload image={image} setImage={setImage} />
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="price">
                <Form.Label>Price </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="brand">
                <Form.Label>Brand </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="category">
                <Form.Label>Category </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="countInstock">
                <Form.Label>Count in Stock </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter CountInStcok"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary">
                Create
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;
