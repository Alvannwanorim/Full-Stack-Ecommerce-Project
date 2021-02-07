import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6} xs={12}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
