import React, { useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { topProductAction } from "../actions/productAction";
import Loader from "./Loader";
import Message from "./Message";
const ProductCarousel = () => {
  const dispatch = useDispatch();

  const topProducts = useSelector((state) => state.topProducts);
  const { products, error, loading } = topProducts;

  useEffect(() => {
    dispatch(topProductAction());
  }, [dispatch]);
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image.url} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name}({product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
