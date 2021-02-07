import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import { Button, Form, Image, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "./Loader";

const FileUpload = ({ image, setImage }) => {
  const [loading, setLoading] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const fileUploadAndResize = (e) => {
    let file = e.target.files[0];

    if (file) {
      setLoading(true);
      Resizer.imageFileResizer(
        file,
        720,
        720,
        "JPEG",
        100,
        0,
        (uri) => {
          axios
            .post(
              `/api/upload/uploadimages`,
              { image: uri },
              {
                headers: { "x-auth-token": userInfo.token },
              }
            )
            .then((res) => {
              // console.log("IMAGE UPLOAD RES DATA", res);
              setLoading(false);
              setImage(res.data);
            })
            .catch((error) => {
              setLoading(false);
              console.log("CLOUDINARY UPLOAD ERROR", error);
            });
        },
        "base64"
      );
    }
  };

  const handleImageDelete = (public_id) => {
    setLoading(true);
    axios
      .post(
        `/api/upload/removeimage`,
        { public_id },
        {
          headers: { "x-auth-token": userInfo.token },
        }
      )
      .then((res) => {
        setLoading(false);
        setImage({});
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <>
      <Form.Label>Add Image</Form.Label>
      <Form.File
        id="image-file"
        label="choose a file"
        custom
        onChange={fileUploadAndResize}
      ></Form.File>
      <Col className="my-3" xs={6} md={4}>
        {loading && <Loader />}
        <Image src={image.url} width={100} height={100} rounded />{" "}
        <Button
          variant="danger"
          className="btn-sm"
          onClick={() => handleImageDelete(image.public_id)}
        >
          <i className="fas fa-times"></i>
        </Button>
      </Col>
    </>
  );
};

export default FileUpload;
